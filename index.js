import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing");
  process.exit(1);
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
  },
});

const CHANNEL = "@OntorVideos";

console.log("🤖 Bot is running...");

// ✅ START COMMAND
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome!\n\n📌 Just send me a VIDEO 🎬\nI will upload it to the channel in movie-style (download + thumbnail + play button)."
  );
});

// 🔴 Polling error log (Railway debugging)
bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

// ✅ VIDEO HANDLER
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // ignore commands
  if (msg.text && msg.text.startsWith("/")) return;

  if (!msg.video) {
    return bot.sendMessage(chatId, "📌 Please send a VIDEO file 🎬");
  }

  const videoPath = ./movie_${chatId}.mp4;

  try {
    const file = await bot.downloadFile(msg.video.file_id, "./");
    fs.renameSync(file, videoPath);

    await bot.sendDocument(CHANNEL, videoPath, {
      caption: ${msg.video.file_name || "Movie"}\n\n🔥 Powered by Ontor Bot,
    });

    fs.unlinkSync(videoPath);

    return bot.sendMessage(chatId, "✅ Video uploaded successfully!");
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return bot.sendMessage(chatId, "❌ Upload failed");
  }
});
