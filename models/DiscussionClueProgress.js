module.exports = (sequelize, DataTypes) => {
  const DiscussionClueProgress = sequelize.define(
    "DiscussionClueProgress",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      materiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clueUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "discussion_clue_progress",
    }
  );

  return DiscussionClueProgress;
};
