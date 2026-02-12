const User = require("../models/User");
const UserMateriProgress = require("../models/UserMateriProgress");
const UserBadge = require("../models/UserBadge");
const Badge = require("../models/Badge");
const Materi = require("../models/Materi");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // ================= USER =================
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "xp"]
    });

    // ================= ACHIEVEMENT PREVIEW =================
    const userBadges = await UserBadge.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Badge,
          attributes: ["id", "badge_name", "icon", "image"] // 🔥 tambah image
        }
      ],
      limit: 3
    });

    const achievements = userBadges.map(b => ({
      id: b.Badge?.id,
      badge_name: b.Badge?.badge_name,
      icon: b.Badge?.icon,
      image: b.Badge?.image   
    }));

    // ================= LEARNING PROGRESS =================
    const progressData = await UserMateriProgress.findAll({
      where: { userId },
      include: [
        {
          model: Materi,
          attributes: ["id", "title"]
        }
      ],
      order: [["updatedAt", "DESC"]],
      limit: 2
    });

    const materi = progressData.map(p => ({
      id: p.materiId,
      title: p.Materi?.title || "Materi",
      progress: p.percent || 0
    }));

    // ================= LEADERBOARD PREVIEW =================
    const leaderboardIndividu = await User.findAll({
      where: { role: "student" }, 
      attributes: ["id", "name", "xp"],
      order: [["xp", "DESC"]],
      limit: 5
    });

    return res.json({
      user,
      achievements,
      materi,
      leaderboard_individu: leaderboardIndividu
    });

  } catch (err) {
    console.log("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
