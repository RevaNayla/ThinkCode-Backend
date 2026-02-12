const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Badge = sequelize.define(
  "Badge",
  {
    badge_name: DataTypes.STRING,
  description: DataTypes.STRING,
  icon: DataTypes.STRING,
  image: DataTypes.STRING, 
  },
  {
    tableName: "badges",
    timestamps: false
  }
);

module.exports = Badge;
