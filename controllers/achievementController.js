const UserBadge = require("../models/UserBadge");
const Badge = require("../models/Badge");

exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("USER ID:", userId);

    const rows = await UserBadge.findAll({
      where: { user_id: userId },
      include: [{ model: Badge }],
      order: [["badge_id", "DESC"]],
    });

    const result = rows.map((row) => ({
      id: row.Badge.id,
      title: row.Badge.badge_name,
      description: row.Badge.description,
      image: `http://localhost:5000${row.Badge.image}`,
    }));

    console.log("ACHIEVEMENT RESULT:", result);

    res.json({
      status: true,
      data: result,
    });
  } catch (err) {
    console.error("ACHIEVEMENT ERROR:", err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
