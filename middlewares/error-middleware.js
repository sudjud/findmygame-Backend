// Импортируем класс
const ApiError = require("../exceptions/api-error");

// Этот мидлвайр будет отвечать за обработку ошибок
module.exports = function (err, req, res, next) {
  // console.log(err);
  /*
 И делаем проверку!
 Если ошибка является instance этого класса, тогда мы сразу возвращаем 
 ответ на клиент
 */
  if (err instanceof ApiError) {
    console.log('error-middleware')
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Произошла ошибка" });
};
