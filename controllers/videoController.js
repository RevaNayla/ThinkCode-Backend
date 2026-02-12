const MateriVideo = require("../models/MateriVideo");
const path = require("path");

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: "File video wajib diupload" });
    }

    const { materiId, title } = req.body;

    const video = await MateriVideo.create({
      materiId,
      title,
      filePath: `/uploads/videos/${req.file.filename}`
    });

    res.json({
      status: true,
      message: "Video berhasil diupload",
      data: video
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getVideoByMateri = async (req, res) => {
  try {
    const materiId = req.params.materiId;
    const video = await MateriVideo.findOne({ where: { materiId } });

    res.json({ status: true, data: video });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};
