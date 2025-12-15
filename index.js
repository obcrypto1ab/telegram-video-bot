import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const CHANNEL = "@OntorVideos";
const userData = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // Save thumbnail image (for logic only)
  if (msg.photo) {
    userData[chatId] = { hasThumb: true };

    return bot.sendMessage(
      chatId,
      "✅ Thumbnail received\nNow send the video 🎬"
    );
  }

  // Handle video
  if (msg.video) {
    try {
      await bot.sendVideo(CHANNEL, msg.video.file_id, {
        caption: "🔥 New Video\nPowered by Ontor Bot",
      });

      delete userData[chatId];

      return bot.sendMessage(
        chatId,
        "✅ Video successfully posted to channel!"
      );
    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "❌ Error posting video");
    }
  }

  bot.sendMessage(chatId, "📌 Send thumbnail image first, then video");
});
