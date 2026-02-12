const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DiscussionMessage = sequelize.define("DiscussionMessage", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "discussion_messages"
});

module.exports = DiscussionMessage;
