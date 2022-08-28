//создаем и сразу экспортируем класс для обработки ошибок
//этот класс будет рассширять (extends) наш дефолтный Error
module.exports = class ApiError extends Error {
  //Добавляем поле status и поле errors
  status;
  errors;
  //То есть когда мы будем пробрасывать ошибку мы будем указывать http-status
  //создаем constructor который параметром принимает
  // 1 - status 2 - сообщение 3 - errors
  constructor(status, message, errors = []) {
    // Так же вызываем родительский конструктор с помощью super
    super(message);
    this.status = status;
    this.errors = errors;
    // И в инстанс этого класса помещаем сообщения и ошибки
  }

  //Создаем пару static функций - это функции которые можно использовать
  //не создавая экземпляр класса
  static UnauthorizedError() {
    // В этой функции мы возвращаем экземпляр текущего класса
    // То есть мы создаем эту ApiError
    return new ApiError(401, "Пользователь не авторизован!");
  }

  //Создаем еще функцию на случай если пользователь указал
  //какие то некорректные параметры или не прощел валидацию или что то еще
  static BadRequest(message, errors = []) {
    // Опять же возвращаем инстанс текущего класса
    return new ApiError(400, message, errors);
  }
};
