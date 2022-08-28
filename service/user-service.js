const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const { tokenService } = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

module.exports.userServise = {
  registration: async (email, password, name) => {
    //Первым делом мы смотрим есть ли в БД пользователь
    //с такими данными
    const candidate = await User.findOne({ email });

    //Если есть, то бросаем ошибку
    if (candidate) {
      // ОПЕРАТОР throw ГЕНЕРИРУЕТ ОШИБКУ

      return res.status(401).json(`Пользователь с таким email уже существует!`);
    }

    //Если нет, то мы хэшируем пароль
    const hash = await bcrypt.hash(password, 3);

    //Ссылка по которой юзер будет активировать аккаунт и подтверждать
    //что эта почта принадлежит ему, эту ссылку для активации для начала
    //нужно сгенерировать и делать это будем с помощью библиотеки
    //UUID  вызвав у него функцию V4 которая возвращает рандомную ссылку
    const acticationLink = uuid.v4();

    //Сохраняем пользователя в базу данных
    const user = await User.create({ email, password: hash, name });
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

    return {
      ...tokens,
      user: userDto,
    };
  },

  /*
  Функция для активации пользователя, которая ожидает на вход 
  сслыку для актиации которая хранится у каждого пользователя
  в базе данных. Первое что мы делаем это ищем пользоваьел в БД
  по этой ссылке, после того как мы нашли пользователя,
  мы меняем его ключ isActivated на true
  */
  userActivate: async (activationLink) => {
    const user = await User.findOne({ activationLink });
    if (!user) {
      // ОПЕРАТОР throw ГЕНЕРИРУЕТ ОШИБКУ
      throw ApiError.BadRequest("Некорректная ссылка активации");
    }
    // console.log('Работает')
    //  меняем ключ на true
    user.isActivated = true;
    // сохраняем изменения
    await user.save();
  },

  login: async (email, password) => {
    // Для начала проверяем есть ли вообще юзер с таким email
    const user = await User.findOne({ email });
    // Если нам проверка вернула null то мы пробрасываем ошибку
    if (!user) {
      // ОПЕРАТОР throw ГЕНЕРИРУЕТ ОШИБКУ
      throw ApiError.BadRequest("Пользователь с таким email не найден!");
    }

    // console.log(user);

    if (!user.isActivated) {
      throw ApiError.BadRequest("Необходимо активировать аккаунт");
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
      throw ApiError.BadRequest("Неверный пароль!");
    }
    // После чего мы выбрасываем все лишнее из Модели
    const userDto = new UserDto(user);
    //Затем мы генерируем пару токенов с помошью функции из tokenService
    const tokens = await tokenService.generateToken({ ...userDto });
    //Затем refresh токен нам нужно сохранить в БД
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  },

  // Параметром принимает refresh токен который мы присылаем из контроллера
  logout: async (refreshToken) => {
    // В это функции мы удаляем refresh токен из базы данных
    const token = await tokenService.removeToken(refreshToken);
    return token;
  },

  refresh: async (refreshToken) => {
    // Сразу в начале делаем проверку есть ли refreshToken
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    // Тут мы пытаемся провалидировать token
    const userData = tokenService.validateRefreshToken(refreshToken);

    // Пользуемся функцией для проверки есть ли токен в базе данных
    const tokenFromDb = await tokenService.findToken(refreshToken);

    // Убеждаемся что и валидация и проверка на токен прошли успешно
    if (!userData || !tokenFromDb) {
      // Если не прошла валидация и токен не нашелся в БД то пробрасываем ошибку
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData.id);
    // После чего мы выбрасываем все лишнее из Модели
    const userDto = new UserDto(user);
    //Затем мы генерируем пару токенов с помошью функции из tokenService
    const tokens = await tokenService.generateToken({ ...userDto });
    //Затем refresh токен нам нужно сохранить в БД
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  },

  // Функция для вывода всех пользователей
  getAllUsers: async () => {
    const users = await User.find();
    return users;
  },
};
