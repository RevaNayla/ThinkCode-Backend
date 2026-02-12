const ExcelJS = require("exceljs");
const Submission = require("../../models/Submission");
const User = require("../../models/User");
const Materi = require("../../models/Materi");
const Badge = require("../../models/Badge");
const UserBadge = require("../../models/UserBadge");
const DiscussionRoom = require("../../models/DiscussionRoom");

exports.list = async (req, res) => {
  try {
    const data = await Submission.findAll({
      include: [User, Materi, { model: Badge, as: "Badge" }], 
      order: [["createdAt", "DESC"]],
    });
    res.json({ status: true, data });
  } catch (err) {
    console.error("ERROR list:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.detail = async (req, res) => {
  try {
    const s = await Submission.findByPk(req.params.id, { 
      include: [User, Materi, { model: Badge, as: "Badge" }] 
    });
    if (!s) return res.status(404).json({ status: false, message: "Not found" });
    res.json({ status: true, data: s });
  } catch (err) { 
    console.error(err); 
    res.status(500).json({ status: false, message: "Server error" }); 
  }
};

exports.feedback = async (req, res) => {
  try {
    const { score, comment, badge_id } = req.body;
    const submissionId = req.params.id;

    const submission = await Submission.findByPk(submissionId);
    if (!submission) return res.status(404).json({ status: false, message: "Submission not found" });

    await Submission.update(
      {
        score,
        feedback: comment,
        badge_id,
        status: "graded",
      },
      { where: { id: submissionId } }
    );

    if (badge_id) {
      const exists = await UserBadge.findOne({
        where: { user_id: submission.userId, badge_id },
      });

      if (!exists) {
        await UserBadge.create({
          user_id: submission.userId,
          badge_id,
        });
      }
    }

    res.json({ status: true, message: "Feedback dan badge tersimpan" });
  } catch (err) {
    console.error("ERROR feedback:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


exports.listRoomsByMateri = async (req, res) => {
  try {
    const materiId = req.params.materiId || req.query.materiId;

    console.log(">>> DEBUG MATERI ID:", materiId);

    const rooms = await DiscussionRoom.findAll({
      where: { materiId }
    });

    console.log(">>> DEBUG ROOMS:", rooms);

    res.json({
      status: true,
      data: rooms
    });

  } catch (err) {
    console.error(">>> ERROR listRoomsByMateri:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      include: [
        { model: User },
        { model: Materi },
        { model: Badge, as: "Badge" },
        { model: DiscussionRoom, required: false } 
      ],
      order: [["createdAt", "DESC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Submissions");

    sheet.columns = [
      { header: "Nama Siswa", key: "name", width: 25 },
      { header: "Materi", key: "materi", width: 25 },
      { header: "Room", key: "room", width: 20 },
      { header: "Jawaban", key: "note", width: 50 },
      { header: "File Path", key: "filePath", width: 50 },
      { header: "Status", key: "status", width: 15 },
      { header: "Score", key: "score", width: 10 },
      { header: "Feedback", key: "feedback", width: 50 },
      { header: "Badge", key: "badge", width: 25 },
      { header: "Tanggal", key: "createdAt", width: 20 },
    ];

    submissions.forEach(sub => {
      sheet.addRow({
        name: sub.User?.name || "-",
        materi: sub.Materi?.title || "-",
        room: sub.DiscussionRoom?.title || "-",
        note: sub.note || "-",
        filePath: sub.filePath || "-",
        status: sub.status || "-",
        score: sub.score || "-",
        feedback: sub.feedback || "-",
        badge: sub.Badge?.badge_name || "-",
        createdAt: sub.createdAt ? sub.createdAt.toLocaleString() : "-",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=submissions.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("ERROR exportExcel:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};