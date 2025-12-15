import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const CHANNEL = "@OntorVideos";

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.video) {
    try {
      await bot.sendVideo(CHANNEL, msg.video.file_id, {
        caption: "🔥 New Video",
      });

      await bot.sendMessage(chatId, "✅ Video posted to channel!");
    } catch (error) {
      console.error("POST ERROR:", error.message);

      await bot.sendMessage(
        chatId,
        "❌ Failed to post video\nCheck bot admin permission or video size"
      );
    }
  } else {
    bot.sendMessage(chatId, "Send a video");
  }
});
