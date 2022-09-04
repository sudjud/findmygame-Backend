//создадим class userDto который хранит в себе некоторую инфу о пользователе
//DTO - DataTransferObject

module.exports = class UserDto {
  name;
  email;
  id;
  isActivated;
  telegramId;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.telegramId = model.telegramId;
  }
};
