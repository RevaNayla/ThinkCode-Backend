const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Materi = require("./Materi"); 

const Clue = sequelize.define("Clue", {
    id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
    materiId: {type:DataTypes.INTEGER },
    clueText: {type:DataTypes.TEXT},
    cost: {type:DataTypes.INTEGER},
  }, 
  { 
    tableName: "clues", 
    timestamps:false });
   Clue.belongsTo(Materi, { foreignKey:"materiId" });

module.exports = Clue;
