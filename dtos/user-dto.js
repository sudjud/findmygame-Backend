//создадим class userDto который хранит в себе некоторую инфу о пользователе
//DTO - DataTransferObject

module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
