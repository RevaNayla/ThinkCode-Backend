const { fn, col } = require("sequelize");

const DiscussionRoom = require("../models/DiscussionRoom");
const RoomMember = require("../models/RoomMember");
const UserMateriProgress = require("../models/UserMateriProgress");
const User = require("../models/User");

/* ================= INDIVIDUAL ================= */
exports.getIndividualLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "student", isActive: true },
      attributes: ["id", "name", "xp"],
      order: [["xp", "DESC"]],
    });

    res.json({ status: true, data: users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status:false });
  }
};


/* ================= GROUP HYBRID ================= */
exports.getGroupLeaderboard = async (req, res) => {
  try {
    const { materiId } = req.query;

    if (!materiId) {
      return res.json({ status: true, data: [] });
    }

    const rooms = await DiscussionRoom.findAll({
      where: { materiId }
    });

    let results = [];

    for (const room of rooms) {

      /* ===== AVG PROGRESS ===== */
      const progress = await UserMateriProgress.findAll({
        where: { roomId: room.id },
        attributes: [[fn("AVG", col("percent")), "avg"]],
        raw: true
      });

      const avgProgress = Number(progress[0]?.avg || 0);

      /* ===== MEMBERS ===== */
      const members = await RoomMember.findAll({
        where: { room_id: room.id },
        raw: true
      });

      const userIds = members.map(m => m.user_id);

      /* ===== TOTAL XP ===== */
      let totalXp = 0;

      if (userIds.length > 0) {
        const xpData = await User.findAll({
          where: { id: userIds },
          attributes: [[fn("SUM", col("xp")), "totalXp"]],
          raw: true
        });

        totalXp = Number(xpData[0]?.totalXp || 0);
      }

      /* ===== FINISH TIME ===== */
      const finish = await UserMateriProgress.findAll({
        where: { roomId: room.id, percent: 100 },
        order: [["updatedAt", "ASC"]],
        limit: 1
      });

      const finishTime = finish[0]?.updatedAt || null;

      results.push({
        roomId: room.id,
        roomName: room.title || `Room ${room.id}`,
        avgProgress,
        totalXp,
        finishTime,
        speedBonus: 0
      });
    }

    /* ===== SPEED BONUS ===== */
    const finished = results
      .filter(r => r.finishTime)
      .sort((a,b) => new Date(a.finishTime) - new Date(b.finishTime));

    finished.forEach((r,i)=>{
      if(i===0) r.speedBonus=20;
      else if(i===1) r.speedBonus=10;
      else if(i===2) r.speedBonus=5;
    });

    /* ===== NORMALIZE XP ===== */
    const maxXp = Math.max(...results.map(r => r.totalXp), 1);

    results = results.map(r => {

      const normalizedXp = r.totalXp / maxXp;

      const score =
        (r.avgProgress * 0.5) +
        (normalizedXp * 100 * 0.3) +
        (r.speedBonus * 0.2);

      return {
        ...r,
        score,
        totalPoint: score   
      };
    });

    results.sort((a,b)=> b.score - a.score);

    res.json({ status: true, data: results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status:false });
  }
};
