const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserProgress = sequelize.define("UserProgress", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  levelId: { type: DataTypes.INTEGER, allowNull: false },
  xp: { type: DataTypes.INTEGER, defaultValue: 0 },
  stars: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: "user_progress",
  timestamps: false
});

module.exports = UserProgress;
