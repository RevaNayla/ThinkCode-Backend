const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LeaderboardKelompok = sequelize.define(
  "LeaderboardKelompok",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "poin",
    },
  },
  {
    tableName: "leaderboard_kelompok",
    timestamps: false,
  }
);

module.exports = LeaderboardKelompok;


