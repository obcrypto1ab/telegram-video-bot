import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const CHANNEL = "@OntorVideos";

// Temporary user storage
const userData = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  /* =========================
     STEP 1: Receive Thumbnail
     ========================= */
  if (msg.photo) {
    // Get highest quality photo
    const photo = msg.photo[msg.photo.length - 1];

    userData[chatId] = {
      thumbnail: photo.file_id,
    };

    return bot.sendMessage(
      chatId,
      "✅ Thumbnail received!\nNow send the video 🎬"
    );
  }

  /* =========================
     STEP 2: Receive Video
     ========================= */
  if (msg.video) {
    // Check thumbnail first
    if (!userData[chatId]?.thumbnail) {
      return bot.sendMessage(
        chatId,
        "❌ Please send thumbnail image first 🖼"
      );
    }

    try {
      await bot.sendVideo(CHANNEL, msg.video.file_id, {
        caption: "🔥 New Video\nPowered by Ontor Bot",
        thumbnail: userData[chatId].thumbnail, // 👈 thumbnail attached
      });

      delete userData[chatId];

      return bot.sendMessage(
        chatId,
        "✅ Video posted to channel successfully!"
      );
    } catch (error) {
      console.error("POST ERROR:", error);
      return bot.sendMessage(
        chatId,
        "❌ Failed to post video\nCheck bot admin permission or video size"
      );
    }
  }

  /* =========================
     DEFAULT MESSAGE
     ========================= */
  bot.sendMessage(
    chatId,
    "📌 First send thumbnail image 🖼\nThen send video 🎬"
  );
});
