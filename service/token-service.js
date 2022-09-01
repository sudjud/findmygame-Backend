const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");

module.exports.tokenService = {
  generateToken: (payload) => {
    const accesToken = jwt.sign(payload, process.env.JWT_ACCES_SECRET, {
      expiresIn: "30d",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_ACCES_SECRET, {
      expiresIn: "30d",
    });
    return { accesToken, refreshToken };
  },

  // Тут мы валидируем токен на случай если он подделанный
  // или с истекшим сроком действия
  validateAccessToken: (token) => {
    try {
      // Тут мы верифицируем токен с помощью функции jwt.verify
      const userData = jwt.verify(token, process.env.JWT_ACCES_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  },
  validateRefreshToken: (token) => {
    try {
      // Тут мы верифицируем токен с помощью функции jwt.verify
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  },
  saveToken: async (userId, refreshToken) => {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
  },

  removeToken: async (refreshToken) => {
    // Здесь мы удаляем токен через token модель
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  },

  // Эта функция будет искать токен в базе данных
  findToken: async (refreshToken) => {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  },
};
