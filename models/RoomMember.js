const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const RoomMember = sequelize.define('RoomMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'room_members', 
  timestamps: false, 
});

module.exports = RoomMember;