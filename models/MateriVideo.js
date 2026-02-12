const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MateriVideo = sequelize.define("MateriVideo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  materiId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: false },
  uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "materi_videos",
  timestamps: false
});

module.exports = MateriVideo;
