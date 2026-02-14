const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkspaceAttempt = sequelize.define('WorkspaceAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'DiscussionRooms',
      key: 'id',
    },
  },
  type: { // Baru: 'pseudocode' atau 'flowchart'
    type: DataTypes.ENUM('pseudocode', 'flowchart'),
    allowNull: false,
  },
  attemptNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: { // Gabung pseudocode atau flowchart (JSON untuk flowchart)
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = WorkspaceAttempt;