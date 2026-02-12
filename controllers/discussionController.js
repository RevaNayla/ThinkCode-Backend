const DiscussionMessage = require("../models/DiscussionMessage");
const DiscussionRoom = require("../models/DiscussionRoom");
const User = require("../models/User");
const MateriSection = require("../models/MateriSection");
const Clue = require("../models/Clue");
const DiscussionClueLog = require("../models/DiscussionClueLog");
const UserMateriProgress = require("../models/UserMateriProgress");
const RoomMember = require("../models/RoomMember");

/* ================= GET ROOMS ================= */
exports.getRooms = async (req, res) => {
  try {
    const materiId = req.params.materiId;

    if (!materiId)
      return res.status(400).json({
        status: false,
        message: "materiId diperlukan",
      });

    const rooms = await DiscussionRoom.findAll({
      where: { materiId },
      attributes: ["id", "materiId", "title", "capacity", "isClosed"],
    });

    const roomsWithCurrent = await Promise.all(
      rooms.map(async (room) => {
        const current = await UserMateriProgress.count({
          where: { roomId: room.id },
        });
        return {
          ...room.toJSON(),
          current, 
        };
      })
    );

    res.json({ status: true, data: roomsWithCurrent });
  } catch (err) {
    console.error("getRooms:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ================= GET ROOM CHAT ================= */
exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await DiscussionMessage.findAll({
      where: { roomId },
      include: [{ model: User, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
    });

    const formatted = messages.map(m => ({
      id: m.id,
      message: m.message,
      createdAt: m.createdAt,
      userId: m.userId,
      userName: m.User?.name || "System",  
      userInitial: m.User ? (m.User.name.charAt(0) || "U").toUpperCase() : "💡", 
      type: m.type || "message", 
    }));

    res.json({ status: true, data: formatted });
  } catch (err) {
    console.error("getRoom:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ================= SEND MESSAGE ================= */
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim())
      return res.status(400).json({
        status: false,
        message: "Pesan kosong",
      });

    const newMsg = await DiscussionMessage.create({
      roomId,
      userId,
      message,
      type: "message",  
    });

    const user = await User.findByPk(userId);

    res.json({
      status: true,
      data: {
        id: newMsg.id,
        message: newMsg.message,
        createdAt: newMsg.createdAt,
        userId,
        userName: user.name,
        userInitial: user.name.charAt(0).toUpperCase(),
        type: "message",
      },
    });
  } catch (err) {
    console.error("sendMessage:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ================= MINI LESSON ================= */
exports.getMiniLesson = async (req, res) => {
  try {
    const { materiId } = req.params;

    const mini = await MateriSection.findOne({
      where: { materiId, type: "mini" },
    });

    if (!mini)
      return res.json({
        status: false,
        message: "Mini lesson tidak ditemukan",
      });

    res.json({ status: true, data: mini });
  } catch (err) {
    console.error("getMiniLesson:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ================= GET CLUES ================= */
exports.getClues = async (req, res) => {
  try {
    const { materiId } = req.params;

    if (!materiId) {
      return res.status(400).json({
        status: false,
        message: "materiId diperlukan",
      });
    }

    const clues = await Clue.findAll({
      where: { materiId },
      order: [["id", "ASC"]],
      attributes: ["id", "clueText", "cost"],
    });

    res.json({
      status: true,
      data: clues.map(c => ({
        id: c.id,
        content: c.clueText,
        cost: c.cost,
      })),
    });
  } catch (err) {
    console.error("getClues error:", err);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

/* ================= USE CLUE (GROUP XP) ================= */
exports.useClue = async (req, res) => {
  const transaction = await DiscussionMessage.sequelize.transaction(); 
  try {
    const { roomId: roomIdStr, clueId: clueIdStr } = req.params;
    const roomId = parseInt(roomIdStr, 10);
    const clueId = parseInt(clueIdStr, 10);
    const userId = req.user.id;
    const io = req.app.get("io");

    // ================= VALIDASI =================
    if (isNaN(roomId) || roomId <= 0)
      return res.status(400).json({ message: "roomId tidak valid" });

    if (isNaN(clueId) || clueId <= 0)
      return res.status(400).json({ message: "clueId tidak valid" });

    // ================= AMBIL USER =================
    const user = await User.findByPk(userId, { transaction });
    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    // ================= AMBIL ROOM =================
    const room = await DiscussionRoom.findByPk(roomId, { transaction });
    if (!room)
      return res.status(404).json({ message: "Room tidak ditemukan" });

    if (!room.materiId)
      return res.status(400).json({ message: "Room tidak punya materiId" });

    const clue = await Clue.findByPk(clueId, { transaction });
    if (!clue)
      return res.status(404).json({ message: "Clue tidak ditemukan" });

    const alreadyUsed = await DiscussionClueLog.findOne({
      where: { roomId, clueId },
      transaction,
    });
    if (alreadyUsed)
      return res.status(400).json({
        message: "Clue ini sudah digunakan di room ini",
      });

    const members = await UserMateriProgress.findAll({
      where: { materiId: room.materiId, roomId },
      transaction,
    });

    if (!members.length)
      return res.status(400).json({
        message: "Tidak ada anggota di room",
      });

    const cost = Number(clue.cost || 0);
    for (const member of members) {
      const userXp = await User.findByPk(member.userId, { attributes: ['xp'], transaction });
      if (member.xp < cost || userXp.xp < cost) {
        await transaction.rollback();
        return res.status(400).json({
          message: `XP anggota ${member.userId} tidak mencukupi (diperlukan ${cost} XP untuk membuka clue). Dapatkan XP tambahan di halaman Mini Game.`,
        });
      }
    }

    // ================= POTONG XP =================
    for (const member of members) {
      member.xp -= cost;
      await member.save({ transaction });

      await User.update(
        { xp: User.sequelize.literal(`xp - ${cost}`) },
        { where: { id: member.userId }, transaction }
      );
    }

    // ================= SIMPAN LOG CLUE =================
    await DiscussionClueLog.create({
      roomId,
      clueId,
      takenBy: userId,
    }, { transaction });

    // ================= SIMPAN CHAT (HISTORY) =================
    const msg2 = await DiscussionMessage.create({
      roomId,
      userId,
      type: "clue",
      message: `💡 Clue: ${clue.clueText}`,
    }, { transaction });

    // ================= SOCKET EMIT =================
    if (io) {
      const combinedClueText = `💡 Clue dibuka oleh ${user.name}. Clue: ${clue.clueText}`;
      io.to(`room-${roomId}`).emit("clueUsed", {
        id: `clue-${msg2.id}`,
        clueText: combinedClueText,
        createdAt: msg2.createdAt,
      });
    }

    await transaction.commit();
    return res.json({
      status: true,
      message: "Clue berhasil dibuka",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("useClue error:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan saat membuka clue",
    });
  }
};

/* ================= USED CLUE HISTORY ================= */
exports.getUsedClues = async (req, res) => {
  try {
    const { roomId } = req.params;

    const logs = await DiscussionClueLog.findAll({
      where: { roomId },
      include: [
        { model: Clue },
        { model: User, attributes: ["name"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    const formatted = logs.map(l => ({
      clueId: l.clueId,
      clueText: l.Clue.clueText,
      takenBy: l.User.name,
      createdAt: l.createdAt,
    }));

    res.json({ status: true, data: formatted });
  } catch (err) {
    console.error("getUsedClues:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= JOIN ROOM ================= */
exports.joinRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const room = await DiscussionRoom.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ status: false, message: "Room tidak ditemukan" });
    }

    const materiId = room.materiId;

    let progress = await UserMateriProgress.findOne({
      where: { userId, materiId }
    });

    if (!progress) {
      progress = await UserMateriProgress.create({
        userId,
        materiId,
        completedSections: "[]",
        percent: 0,
        roomId: null
      });
    }

    if (progress.roomId && progress.roomId !== parseInt(roomId)) {
      return res.status(400).json({
        status: false,
        message: `Anda sudah join Room ${progress.roomId}. Tidak bisa join room lain.`
      });
    }

    await progress.update({ roomId: parseInt(roomId) });

    const alreadyMember = await RoomMember.findOne({
      where: { room_id: roomId, user_id: userId }
    });

    if (!alreadyMember) {
      await RoomMember.create({
        room_id: roomId,
        user_id: userId
      });
    }

    res.json({ status: true, message: "Berhasil join room", roomId });
  } catch (err) {
    console.error("joinRoom:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ================= CAN USE CLUE  ================= */
exports.canUseClue = async (req, res) => {
  try {
    const { roomId, clueId } = req.params;
    const userId = req.user.id;

    const room = await DiscussionRoom.findByPk(roomId);
    if (!room) return res.status(404).json({ status: false, message: "Room tidak ditemukan" });

    const clue = await Clue.findByPk(clueId);
    if (!clue) return res.status(404).json({ status: false, message: "Clue tidak ditemukan" });

    const members = await UserMateriProgress.findAll({
      where: { materiId: room.materiId, roomId },
    });

    const cost = clue.cost;
    let canUse = true;
    let message = "XP cukup untuk semua anggota.";
    for (const member of members) {
      if (member.xp < cost) {
        canUse = false;
        message = `XP anggota tidak cukup. Dapatkan XP di Game/Mini Game.`;
        break;
      }
    }

    res.json({ status: true, canUse, message });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ================= GET USER XP ================= */
exports.getUserXp = async (req, res) => {
  try {
    const { materiId } = req.params;
    const userId = req.user.id;

    const progress = await UserMateriProgress.findOne({
      where: { userId, materiId },
      attributes: ['xp'],
    });

    res.json({ status: true, xp: progress?.xp || 0 });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};