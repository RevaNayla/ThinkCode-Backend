const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Achievement = sequelize.define("Achievement", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,  
    allowNull: false
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: "achievement",
  timestamps: false
});

module.exports = Achievement;
