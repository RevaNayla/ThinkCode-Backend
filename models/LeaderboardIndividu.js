const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LeaderboardIndividu = sequelize.define(
  "LeaderboardIndividu",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "leaderboard_individu",
    timestamps: false,
  }
);

module.exports = LeaderboardIndividu;
