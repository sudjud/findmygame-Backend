const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const telegramApi = require('node-telegram-bot-api');
const { botApi } = require('./service/telegram-service.js');
require('dotenv').config(); 
 
app.use(express.json());
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cors());
app.use(require("./routes/index.js"));
app.use(express.static('uploads/images'));


botApi.saveCommands();
botApi.saveId();


mongoose.
  connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Сервер запущен на localhost:${process.env.PORT}`);
    })
  })
  .catch(() => console.log('Ошибка при соединении с сервером'));