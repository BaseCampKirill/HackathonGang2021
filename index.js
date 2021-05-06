import TelegramBot from "node-telegram-bot-api";
import FileSync from "lowdb/adapters/FileSync.js";
import low from "lowdb";

const adapter = new FileSync("db.json");
const db = low(adapter);

const token = "1722824203:AAGpifUOtA6FH0RsJVUDtp1VzJJWuKPb_eg";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Привет. Мы проект RecyclePoint. Бот за чистую планету, помоги ему найти точки для сбора мусора`
  );
});

bot.on("location", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Добавлена новая локация ${msg.location.latitude}, ${msg.location.longitude}`
  );
  db.get("points")
    .push({
      name: "location name",
      x: msg.location.latitude,
      y: msg.location.longitude,
    })
    .write();
});

bot.onText(/\/getRecyclePoints/, async (msg) => {
  const chatId = msg.chat.id;
  const data = await db.get("points");
  console.log(data);
  bot.sendMessage(chatId, JSON.stringify(data));
});
