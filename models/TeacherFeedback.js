const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); 

const TeacherFeedback = sequelize.define(
  "TeacherFeedback",
  {
    answer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    badge_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "teacher_feedback",
    timestamps: false, 
  }
);

module.exports = TeacherFeedback;
