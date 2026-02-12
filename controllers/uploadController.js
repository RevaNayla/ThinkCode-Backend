const multer = require("multer");
const path = require("path");
const Submission = require("../models/Submission");
const Badge = require("../models/Badge");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname)
});

const uploadMiddleware = multer({ storage });
exports.uploadMiddleware = uploadMiddleware.single("file");

// Upload jawaban
exports.uploadAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { materiId, note } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const submission = await Submission.create({
      userId,
      materiId,
      note,
      filePath
    });

    res.json({ status: true, data: submission });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getUploadsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const list = await Submission.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    res.json({ status: true, data: list });

  } catch (err) {
    console.error("GET UPLOADS ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getLastUpload = async (req, res) => {
  try {
    const { userId, materiId } = req.params;

    const last = await Submission.findOne({
      where: { userId, materiId },
      include: [
        { model: require("../models/User"), as: "User" }, 
        { model: require("../models/Materi"), as: "Materi" }, 
        { model: Badge, as: "Badge" }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({ status: true, data: last });

  } catch (err) {
    console.error("LAST UPLOAD ERROR:", err);
    res.status(500).json({ status: false });
  }
};
