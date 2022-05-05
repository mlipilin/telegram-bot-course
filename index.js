const TelagramApi = require("node-telegram-bot-api");

const { againOptions, gameOptions } = require("./options");

const TOKEN = "5313825705:AAHGo4LdvQQ6E3IqVSlOvWXPcr63XAvZT9c";

const bot = new TelagramApi(TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю число от 0 до 9, а ты должен его угадать"
  );
  const randomNumber = Math.floor(Math.random() * 10).toString();
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай :)", gameOptions);
};

function start() {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Получить информацию о пользователе",
    },
    {
      command: "/game",
      description: "Игра в угадай цифру",
    },
  ]);

  bot.on("message", async (msg) => {
    console.log("msg", msg);
    const {
      text,
      chat: { id: chatId },
    } = msg;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/8.jpg"
      );
      return bot.sendMessage(chatId, "Добро пожаловать!");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
  });

  bot.on("callback_query", async (msg) => {
    console.log("msg", msg);
    const {
      data,
      message: {
        chat: { id: chatId },
      },
    } = msg;

    if (data === "/again") {
      return startGame(chatId);
    } else if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал число ${data}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению, ты не угадал, бот выбрал выбрал число ${chats[chatId]}`,
        againOptions
      );
    }
  });
}

start();
