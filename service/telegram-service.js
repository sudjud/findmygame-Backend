// const telegramApi = require("node-telegram-bot-api");
// const TG_TOKEN = require("../token");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const bot = new telegramApi(TG_TOKEN, {
//   polling: true,
// });

// module.exports.botApi = {
//   saveCommands: () => {
//     bot.setMyCommands([
//       {
//         command: "/start",
//         description: "Запустить бота",
//       },
//     ]);
//   },
//   saveId: () => {
//     bot.on("message", async (msg) => {
//       const text = msg.text;
//       const chatId = msg.chat.id;

//       if (text === "/start") {
//         await bot.sendMessage(
//           chatId,
//           "Мир тебе! Отправь мне почту и пароль от аккаунта FindMyGame, чтобы я мог уведомлять тебя о заполнении твоей команды. Раздели почту и пароль простым пробелом, вот так: my@mail.ru password"
//         );
//       }
//       if (
//         text.includes(" ") &&
//         text.includes("@") &&
//         (text.includes(".ru") || text.includes(".com"))
//       ) {
//         const User = await mongoose.models.User;
//         const [mail, password] = text.split(" ");
//         const candidate = await User.find({
//           email: mail,
//         });
//         if (!candidate) {
//           return bot.sendMessage(chatId, "Неправильная почта или пароль");
//         }
//         const isRightPass = await bcrypt.compare(
//           password,
//           candidate[0].password
//         );
//         if (!isRightPass) {
//           return bot.sendMessage(chatId, "Неправильная почта или пароль");
//         }
//         candidate[0].telegramId = chatId;
//         candidate[0].save();
//         return bot.sendMessage(
//           chatId,
//           "Отлично! Теперь я буду уведомлю тебя, если кто-то придет в команду."
//         );
//       }
//     });
//   },

//   joinedNotify: async (message, tgId) => {
//     await bot.sendMessage(tgId, message);
//   },
// };
