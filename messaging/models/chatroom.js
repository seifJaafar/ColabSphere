"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Chatroom.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      projectID: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      pinnedMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      importantLink: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize, // This is the crucial fix
      modelName: "Chatroom",
      tableName: "chatrooms", // Explicit table name
      timestamps: true,
    }
  );

  return Chatroom;
};
