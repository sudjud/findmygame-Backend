//nodemailer нам нужен для отправки письма на почту
const nodemailer = require("nodemailer");

class mailService {
  /*
    Создаем constructor и там инициализируем почтовый клиент.
    В this добавляем еще одно поле которое называется transporter,
    именно с помощью него мы будем отправлять письма на почту.
    У nodemailer вызываем функцию createTransport и прописываем там некоторые настройки
  */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      secure: true,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    /*
  Вызываем функцию sendMail которая параметром принимает объект
  у которого должны быть поля:
  */
    await this.transporter.sendMail({
      // поле from - почта от которой исходит письмо
      from: process.env.SMPT_USER,
      // поле to - mail пользователя которому мы отправляем письмо
      to,
      // subject - тема письма
      // API_URL - URL нашего сайта
      subject: "Активация письма на" + process.env.API_URL,
      text: "",
      html: `
      <div>
        <h1>
         Для активации аккаунtа перейдите по ссылке
        </h1>
        <a href="${link}}">${link}</a>
      </div>
      `,
    });
  }
}

module.exports = new mailService();
