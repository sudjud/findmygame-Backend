const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String, 
    required: true,
  },
  //Подтвердил пользователь почту или нет!
  isActivated: {
    type: Boolean,
    default: false,
  },
  //
  activationLink: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
