const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  uploadPhoto,
  changePassword,
  getProgress
} = require("../controllers/authController");


const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadPhoto");
const auth = require("../middleware/auth");
const User = require("../models/User");


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", verifyToken, getMe);
router.put("/update", verifyToken, updateProfile);
router.post("/upload-photo", verifyToken, upload.single("photo"), uploadPhoto);
router.put("/change-password", verifyToken, changePassword);
router.get("/dashboard/progress", verifyToken, getProgress);

  router.get("/dashboard", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId, { attributes: ["id", "name", "xp"] });
  if (!user) return res.status(404).json({ status: false, message: "User tidak ditemukan" });
  res.json({
    status: true,
    user,
    progress: { xp: user.xp, level: Math.floor(user.xp / 100) },
    achievements: ["Badge1", "Badge2", "Badge3"]
  });
});

module.exports = router;