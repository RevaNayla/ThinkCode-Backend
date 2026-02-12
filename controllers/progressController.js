const db = require("../database/db");

module.exports = {
  getProgress: (req, res) => {
    const { userId, materiId } = req.params;

    db.query(
      `SELECT * FROM user_progress WHERE user_id = ? AND materi_id = ?`,
      [userId, materiId],
      (err, result) => {
        if (err) return res.status(500).json({ error: "DB error" });

        if (result.length === 0) {
          return res.json({
            completed_steps: 0,
            total_steps: 0,
            progress_percent: 0,
          });
        }

        res.json(result[0]);
      }
    );
  },

  updateProgress: (req, res) => {
    const { userId, materiId } = req.body;

    const sqlTotal = `
      SELECT COUNT(*) AS total FROM materi_steps WHERE materi_id = ?
    `;

    db.query(sqlTotal, [materiId], (err, totalResult) => {
      if (err) return res.status(500).json({ error: "DB error" });

      const totalSteps = totalResult[0].total;

      const sqlCheck = `
        SELECT * FROM user_progress WHERE user_id = ? AND materi_id = ?
      `;

      db.query(sqlCheck, [userId, materiId], (err, progressResult) => {
        if (err) return res.status(500).json({ error: "DB error" });

        let completed = 1;

        if (progressResult.length > 0) {
          completed = progressResult[0].completed_steps + 1;
          if (completed > totalSteps) completed = totalSteps;
        }

        const progressPercent = Math.round((completed / totalSteps) * 100);

        const sqlSave = progressResult.length === 0
          ? `INSERT INTO user_progress (user_id, materi_id, completed_steps, total_steps, progress_percent)
             VALUES (?, ?, ?, ?, ?)`
          : `UPDATE user_progress 
             SET completed_steps = ?, progress_percent = ?, updated_at = NOW()
             WHERE user_id = ? AND materi_id = ?`;

        const params =
          progressResult.length === 0
            ? [userId, materiId, completed, totalSteps, progressPercent]
            : [completed, progressPercent, userId, materiId];

        db.query(sqlSave, params, (err2) => {
          if (err2) return res.status(500).json({ error: "DB error" });

          res.json({
            message: "Progress updated",
            completed_steps: completed,
            total_steps: totalSteps,
            progress_percent: progressPercent,
          });
        });
      });
    });
  },
};
