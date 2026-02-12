const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DiscussionClueLog = sequelize.define("DiscussionClueLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  roomId: { type: DataTypes.INTEGER, allowNull: false },
  clueId: { type: DataTypes.INTEGER, allowNull: false },
  takenBy: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "discussion_clue_logs",
  timestamps: true
});

module.exports = DiscussionClueLog;
