const GameLevel = require("../models/GameLevel");
const GameQuestion = require("../models/GameQuestion");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");
const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");

/* ================= GET ALL LEVEL ================= */
exports.getLevels = async (req, res) => {
  try {
    const levels = await GameLevel.findAll({
      order: [["materi_id", "ASC"], ["levelNumber", "ASC"]],
    });

    res.json({ status: true, data: levels });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

/* ================= USER PROGRESS ================= */
exports.getProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findAll({
      where: { userId: req.user.id },
    });

    res.json({ status: true, data: progress });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

/* ================= GET LEVEL BY ID ================= */
exports.getLevel = async (req, res) => {
  try {
    const level = await GameLevel.findByPk(req.params.id);
    if (!level) {
      return res.status(404).json({ status: false, message: "Level tidak ditemukan" });
    }

    const questions = await GameQuestion.findAll({
      where: { levelId: level.id },
      order: [["id", "ASC"]],
    });

    res.json({ status: true, level, questions });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

/* ================= SUBMIT LEVEL ================= */
exports.submitLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const levelId = req.params.id;
    const answers = req.body.answers || [];

    const level = await GameLevel.findByPk(levelId, {
      include: [{ model: Badge }], 
    });

    if (!level) {
      return res.status(404).json({ status: false });
    }

    let correct = 0;

    for (const ans of answers) {
      const q = await GameQuestion.findByPk(ans.questionId);
      if (!q) continue;

      let meta = q.meta;
      if (typeof meta === "string") meta = JSON.parse(meta);

      if (q.type === "mcq") {
        if (Number(ans.answer) === Number(meta.answerIndex)) correct++;
      }

      if (["essay", "fill"].includes(q.type)) {
        if (
          String(ans.answer).trim().toLowerCase() ===
          String(meta.answer).trim().toLowerCase()
        ) {
          correct++;
        }
      }
    }

    const total = answers.length;
    const scorePercent = Math.round((correct / total) * 100);
    const gainedXp = scorePercent >= 60 ? level.reward_xp : 5;

    // ===== SIMPAN PROGRESS =====
    await UserProgress.upsert({
      userId,
      levelId,
      completed: scorePercent >= 60,
      score: scorePercent,
    });

    // ===== TAMBAH XP =====
    const user = await User.findByPk(userId);
    user.xp += gainedXp;
    await user.save();

    // ===== BADGE =====
    let badge = null;

if (scorePercent === 100 && level.Badge) {
  await UserBadge.findOrCreate({
    where: {
      user_id: userId,
      badge_id: level.Badge.id,
    },
  });

badge = {
  badge_name: level.Badge.badge_name,
  image: `${process.env.BASE_URL}${level.Badge.image}`,
};
}


    return res.json({
      status: true,
      total,
      correct,
      scorePercent,
      gainedXp,
      totalXpUser: user.xp,
      badge,
    });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};


exports.addXp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { xp } = req.body;

    if (!xp || Number(xp) <= 0) {
      return res.status(400).json({
        status: false,
        message: "XP tidak valid"
      });
    }

    // UPDATE XP USER
    await User.increment(
      { xp: Number(xp) },
      { where: { id: userId } }
    );

    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "xp"]
    });

    return res.json({
      status: true,
      message: "XP berhasil ditambahkan",
      xp: updatedUser.xp
    });

  } catch (err) {
    console.error("ADD XP ERROR:", err);
    res.status(500).json({
      status: false,
      message: "Gagal menambahkan XP"
    });
  }
};

