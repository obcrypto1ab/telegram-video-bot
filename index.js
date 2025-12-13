import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.video) {
    await bot.sendVideo(chatId, msg.video.file_id, {
      caption: "🎬 Tap to watch\nPowered by Ontor Bot",
    });
  } 
  else {
    await bot.sendMessage(
      chatId,
      "👋 Send a video\nI will post it with perfect preview 🎯"
    );
  }
});
