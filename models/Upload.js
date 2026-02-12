const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Upload = sequelize.define("Upload", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  materiId: { type: DataTypes.INTEGER, allowNull: false },
  sectionId: { type: DataTypes.INTEGER },
  filePath: { type: DataTypes.STRING },
  note: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('pending','reviewed','rejected'), defaultValue: 'pending' },
  teacherFeedback: { type: DataTypes.TEXT },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  badge: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "uploads"
});

module.exports = Upload;
