const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/videos/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Format hanya mendukung .mp4"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/upload", upload.single("video"), videoController.uploadVideo);

router.get("/:materiId", videoController.getVideoByMateri);

module.exports = router;
