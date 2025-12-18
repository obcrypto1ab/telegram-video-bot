import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHANNEL = "@OntorVideos";

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.video) {
    return bot.sendMessage(chatId, "📌 Send video file only");
  }

  const videoPath = ./movie_${chatId}.mp4;
  const file = await bot.downloadFile(msg.video.file_id, "./");
  fs.renameSync(file, videoPath);

  try {
    await bot.sendDocument(
      CHANNEL,
      videoPath,
      {
        caption: ${msg.video.file_name || "Movie"}\n\n🔥 Powered by Ontor Bot,
      }
    );

    fs.unlinkSync(videoPath);

    return bot.sendMessage(chatId, "✅ Movie uploaded (download style)");
  } catch (e) {
    console.error(e);
    return bot.sendMessage(chatId, "❌ Upload failed");
  }
});
