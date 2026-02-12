const User = require("../../models/User");
const Materi = require("../../models/Materi");
const DiscussionRoom = require("../../models/DiscussionRoom");
const Submission = require("../../models/Submission");

exports.getSummary = async (req, res) => {
  try {
    const totalSiswa = await User.count({ where: { role: "student" } });
    const totalMateri = await Materi.count();
    const totalRoom = await DiscussionRoom.count();
    const pendingSubmission = await Submission.count({ where: { status: "pending" } });

    // Rata-rata XP
    const xpResult = await User.findAll({
      attributes: [
        [User.sequelize.fn("AVG", User.sequelize.col("xp")), "avgXP"]
      ],
      raw: true
    });

    const avgXP = xpResult[0].avgXP || 0;

    // Top XP
    const topXP = await User.findAll({
      where: { role: "student" },
      order: [["xp", "DESC"]],
      limit: 5,
      attributes: ["name", "xp"]
    });

    res.json({
      totalSiswa,
      totalMateri,
      totalRoom,
      pendingSubmission,
      avgProgress: Math.round(avgXP),
      topXP
    });
  } catch (err) {
    console.error("Error getSummary:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const submissions = await Submission.findAll({
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: Materi, attributes: ["id", "title"] }
      ]
    });

    const recentActivity = submissions.map(s => ({
      id: s.id,
      user: s.User.name,
      materi: s.Materi.title,
      status: s.status,
      createdAt: s.createdAt
    }));

    res.json(recentActivity);
  } catch (err) {
    console.error("Error getRecentActivity:", err);
    res.status(500).json({ message: "Server error" });
  }
};
