const TeacherFeedback = require("../models/TeacherFeedback");

exports.getFeedbackByAnswer = async (req, res) => {
  const { answerId } = req.params;

  try {
    const feedback = await TeacherFeedback.findOne({ where: { answer_id: answerId } });

    if (!feedback) {
      return res.status(404).json({ comment: "Belum ada feedback." });
    }

    res.json({ comment: feedback.comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ comment: "Server error." });
  }
};

exports.createOrUpdateFeedback = async (req, res) => {
  const { answer_id, teacher_id, comment, points, badge_id } = req.body;
  try {
    const [feedback, created] = await TeacherFeedback.upsert({
      answer_id,
      teacher_id,
      comment,
      points,
      badge_id,
    });

    res.json({ message: "Feedback disimpan", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
