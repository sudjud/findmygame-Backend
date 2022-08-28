// Импортируем класс
const ApiError = require("../exceptions/api-error");
const { tokenService } = require("../service/token-service");

// middleware для проверки авторизации пользователя
module.exports = function (req, res, next) {
  try {
    // Забираем из header наш токен
    const authorizationHeader = req.headers.authorization;

    // Разбиваем и достаем наш токен с помощью split
    const accesToken = authorizationHeader.split(" ")[1];
    // Делаем проверку - есть ли токен
    if (!accesToken) {
      return next(ApiError.UnauthorizedError());
    }
    // Валидируем наш токен с помощью функции из tokenServis
    const userData = tokenService.validateAccessToken(accesToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    // Если все прошло без ошибок то мы в req.user помешаем
    req.user = userData;
    // И передаем управление следующему middleware
    next();
  } catch (error) {
    // console.log(error.toString());
    return next(ApiError.UnauthorizedError());
  }
};
