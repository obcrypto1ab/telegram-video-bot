import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

// ===== SAFETY CHECK =====
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN NOT FOUND");
  process.exit(0); // crash না করে stop
}

// ===== BOT INIT =====
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const CHANNEL = "@OntorVideos";

console.log("🤖 Bot started safely");

// ===== GLOBAL ERROR HANDLING =====
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// ===== START COMMAND =====
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Bot is online!\n\n📌 Just send a VIDEO 🎬\nI will upload it to the channel in movie-style."
  );
});

// ===== POLLING ERROR (Railway fix) =====
bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

// ===== VIDEO HANDLER =====
bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;

    // ignore commands
    if (msg.text && msg.text.startsWith("/")) return;

    if (!msg.video) {
      await bot.sendMessage(chatId, "📌 Please send a VIDEO 🎬");
      return;
    }

    const tempPath = ./video_${chatId}.mp4;

    const filePath = await bot.downloadFile(msg.video.file_id, "./");
    fs.renameSync(filePath, tempPath);

    await bot.sendDocument(CHANNEL, tempPath, {
      caption: ${msg.video.file_name || "Movie"}\n\n🔥 Powered by Ontor Bot,
    });

    fs.unlinkSync(tempPath);

    await bot.sendMessage(chatId, "✅ Video uploaded successfully!");
  } catch (err) {
    console.error("MESSAGE ERROR:", err);
  }
});
