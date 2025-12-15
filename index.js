import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// Temporary thumbnail store (per chat)
const userThumbnail = {};

const CHANNEL = "@OntorVideos"; // তোমার channel username

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // 1️⃣ Thumbnail image receive
  if (msg.photo) {
    // highest quality image
    const photo = msg.photo[msg.photo.length - 1];
    userThumbnail[chatId] = photo.file_id;

    return bot.sendMessage(
      chatId,
      "✅ Thumbnail saved\nNow send the video 🎬"
    );
  }

  // 2️⃣ Video receive
  if (msg.video) {
    const options = {
      caption: "🔥 New Video\nPowered by Ontor Bot",
    };

    // যদি thumbnail আগে পাঠানো হয়
    if (userThumbnail[chatId]) {
      options.thumbnail = userThumbnail[chatId];
    }

    await bot.sendVideo(CHANNEL, msg.video.file_id, options);

    // clear thumbnail after use
    delete userThumbnail[chatId];

    return bot.sendMessage(chatId, "✅ Video posted with thumbnail!");
  }

  // Default message
  bot.sendMessage(
    chatId,
    "📌 Send thumbnail image first, then send video"
  );
});
