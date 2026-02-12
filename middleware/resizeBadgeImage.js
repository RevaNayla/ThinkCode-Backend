const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = async function resizeBadgeImage(req, res, next) {
  try {
    if (!req.file) return next();

    const uploadDir = path.join("uploads", "badges");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const inputPath = req.file.path;
    const outputFilename = `badge-${Date.now()}.png`;
    const outputPath = path.join(uploadDir, outputFilename);

    await sharp(inputPath)
      .resize(128, 128, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath);

    fs.unlinkSync(inputPath);

    req.file.filename = outputFilename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    console.error("Resize error:", err);
    next(err);
  }
};
