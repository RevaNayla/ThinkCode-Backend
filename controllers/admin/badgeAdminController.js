const { Badge } = require("../../models");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/badges"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

module.exports = {
  upload,
  async getAll(req, res) {
    try {
      const badges = await Badge.findAll({ order: [["id", "DESC"]] });
      res.json({ success: true, data: badges });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // CREATE
  async create(req, res) {
    try {
      const { badge_name, description, icon } = req.body;
      const image = req.file ? `/uploads/badges/${req.file.filename}` : null;

      if (!badge_name) return res.json({ success: false, message: "Nama badge wajib diisi" });

      const badge = await Badge.create({ badge_name, description, icon, image });
      res.json({ success: true, data: badge });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const badge = await Badge.findByPk(req.params.id);
      if (!badge) return res.status(404).json({ success: false, message: "Badge tidak ditemukan" });

      const { badge_name, description, icon } = req.body;
      const image = req.file ? `/uploads/badges/${req.file.filename}` : badge.image;

      await badge.update({ badge_name, description, icon, image });
      res.json({ success: true, data: badge });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE
  async remove(req, res) {
    try {
      const deleted = await Badge.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.json({ success: false, message: "Badge tidak ditemukan" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
