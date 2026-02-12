const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Badge = require("./Badge");

const UserBadge = sequelize.define(
  "UserBadge",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    badge_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "user_badges",
    timestamps: false,
    freezeTableName: true,
  }
);

UserBadge.belongsTo(Badge, {
  foreignKey: "badge_id",
});

module.exports = UserBadge;
