import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import sharp from "sharp";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHANNEL = "@OntorVideos";

const userData = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  /* ================= THUMBNAIL ================= */
  if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1];

    const rawThumb = ./raw_thumb_${chatId}.jpg;
    const finalThumb = ./thumb_${chatId}.jpg;

    const downloaded = await bot.downloadFile(photo.file_id, "./");
    fs.renameSync(downloaded, rawThumb);

    // Resize + compress for Telegram
    await sharp(rawThumb)
      .resize(1280, 720, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(finalThumb);

    fs.unlinkSync(rawThumb);

    userData[chatId] = { thumbPath: finalThumb };

    return bot.sendMessage(
      chatId,
      "✅ Thumbnail received & optimized\nNow send video 🎬"
    );
  }

  /* ================= VIDEO ================= */
  if (msg.video) {
    if (!userData[chatId]) {
      return bot.sendMessage(chatId, "❌ Send thumbnail first 🖼");
    }

    const videoPath = ./video_${chatId}.mp4;
    const downloaded = await bot.downloadFile(msg.video.file_id, "./");
    fs.renameSync(downloaded, videoPath);

    try {
      await bot.sendVideo(
        CHANNEL,
        videoPath,
        {
          caption: "🔥 New Video\nPowered by Ontor Bot",
          thumb: userData[chatId].thumbPath,
          supports_streaming: true,
          width: 1280,
          height: 720,
        }
      );

      fs.unlinkSync(videoPath);
      fs.unlinkSync(userData[chatId].thumbPath);
      delete userData[chatId];

      return bot.sendMessage(
        chatId,
        "✅ Video posted with thumbnail successfully!"
      );
    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "❌ Upload failed");
    }
  }

  /* ================= DEFAULT ================= */
  bot.sendMessage(
    chatId,
    "📌 First send thumbnail image 🖼\nThen send video 🎬"
  );
});
