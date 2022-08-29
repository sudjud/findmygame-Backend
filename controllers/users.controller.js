const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("../service/mail-service");
const { tokenService } = require("../service/token-service");
const UserDto = require("../dtos/user-dto");
const jwt = require("jsonwebtoken");
// const ApiError = require("../exceptions/api-error");

//Импортируем функцию регистрации пользователя
const { userServise } = require("../service/user-service");
//Импортруем функцию для получения результатов валидации
const { validationResult } = require("express-validator");
//Импортируем класс ApiError для обработки ошибок
// const ApiError = require("../exceptions/api-error");

module.exports.userController = {
  registration: async (req, res, next) => {
    try {
      /*
      Создаем переменную errors туда сохраняем наши результаты
      валидации и передаем в функцию request, из него автоматически
      достанется тело и провалидируются поля
      */

      const errors = validationResult(req);
      // console.log(errors.formatter);
      /*
      Затем мы делаем условие и проверяем, находится ли что нибудь в errors
      Если он не пустой значит произошла какая то ошибка при валидации
      и нам необходима передать ее в ErrorHandler в наш middleware
      */
      if (!errors.isEmpty()) {
        console.log(2, errors);
        return res.status(401).json({ error: "Некорректные данные!" });
      }

      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(401)
          .json({ error: "Пользователь с таким email уже существует!" });
      }

      //Если нет, то мы хэшируем пароль
      const hash = await bcrypt.hash(password, 3);
      const user = User.create({ email, password: hash, name });

      //Ссылка по которой юзер будет активировать аккаунт и подтверждать
      //что эта почта принадлежит ему, эту ссылку для активации для начала
      //нужно сгенерировать и делать это будем с помощью библиотеки
      //UUID  вызвав у него функцию V4 которая возвращает рандомную ссылку
      const acticationLink = uuid.v4();

      //После создания юзера нам нужно отправить на его почту сообщение о подтверждении
      //Для этого мы создали функцию в Mail-Service
      await mailService.sendActivationMail(
        email,
        `${process.env.API_URL}/activate/${acticationLink}`
      );
      //Параметром в функцию generateToken() нужно передать PAYLOAD
      //создадим class userDto который хранит в себе некоторую инфу о пользователе
      //DTO - DataTransferObject
      //Импортруем класс userDto и с помощью new создаем экземпляр
      //этого класса и как параметр в constructor мы передаем модель
      //у нас это просто объект user
      const userDto = new UserDto(user); // id, email, isActivated

      //Используем спред оператор (...) и передаем новый объект
      const tokens = tokenService.generateToken({ ...userDto });

      //сохраняем наш refreshToken в базу данных
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      // return {
      //   ...tokens,
      //   user: userDto,
      // };

      //refresh token мы будем хранить в cookie
      // 1-й параметр это ключ по которому cookie будет сохраняться
      // 2-й параметр это сама cookie
      // 3-й параметр это опции
      // res.cookie("refreshToken", userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      // });

      console.log("контроллер Регистрация");

      return res.json(user);
    } catch (error) {
      console.log(2222, error.toString());
      res.json(error.toString());
      // next(error.toString());
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // вызываем функцию login из userService
      // const userData = await userServise.login(email, password);
      const user = await User.findOne({ email });
      // Если нам проверка вернула null то мы пробрасываем ошибку
      if (!user) {
        return res
          .status(401)
          .json({ error: "Пользователь с таким email не найден!" });
      }

      if (!user.isActivated) {
        return res
          .status(401)
          .json({ error: "Необходимо активировать аккаунт" });
      }
      /*
    Если поьзователь нашелся, то нам уже нужно сравнить пароли
    Пароль у нас хранися в захэшированном виде
    Для сравнения пароля клиента и пароля который в захэшированном виде
    в bcrypt есть функция compare который первым параметром принимает 
    пароль клиента, а вторым параметром пароль из базы данных
    */
      const isPasswordEquals = await bcrypt.compare(password, user.password);
      //Если пароли не равны мы возвращаем ошибку
      if (!isPasswordEquals) {
        return res.status(401).json({ error: "Неверный пароль!" });
      }
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      // После чего мы выбрасываем все лишнее из Модели
      const userDto = new UserDto(user);
      //Затем мы генерируем пару токенов с помошью функции из tokenService
      const tokens = await tokenService.generateToken({ ...userDto });
      //Затем refresh токен нам нужно сохранить в БД
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return res.json({ user, tokens });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      // Из cookie мы вытаскиваем refresh токен
      const { refreshToken } = req.cookies;
      // Вызываем у сервиса функцию logout и передаем в нее этот refreshToken
      const token = await userServise.logout(refreshToken);
      // Так же удаляем саму cookie с refresh токеном с помощью функции clearCookie
      res.clearCookie("refreshToken");
      // И возвращаем ответ на клиент
      res.json(token);
    } catch (error) {
      next(error);
    }
  },
  activate: async (req, res, next) => {
    try {
      // забираем ссылку активации из params
      const activationLink = req.params.link;

      // вызываем функцию activate из userService
      // и параметром передаем ссылку для активации
      await userServise.userActivate(activationLink);
      // const user = await User.findOne({ activationLink });
      // console.log(user);
      /*
      Поскольку БЭК и ФРОНТ у нас находятся на разных адресах
      нам нужно после того как пользователь перешел по этой ссылке
      redirect-нуть его на фронтенд
      То есть вызываем у response функцию redirect и передаем туда адресс
      */
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  },
  // Эта функция будет перезаписывать токен
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userServise.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  },
  // Функция для получения всех пользователей
  getUsers: async (req, res, next) => {
    try {
      const users = await userServise.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  },
};
