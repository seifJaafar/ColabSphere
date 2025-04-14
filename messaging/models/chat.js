"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Relation to Chatroom (many-to-one)
      Chat.belongsTo(models.Chatroom, {
        foreignKey: "chatroomID",
        as: "chatroom",
        onDelete: "CASCADE", // Delete chat members when chatroom is deleted
      });

      // Relation to User (many-to-one)
      Chat.belongsTo(models.User, {
        foreignKey: "userID",
        as: "user",
        onDelete: "CASCADE", // Delete chat members when user is deleted
      });

      // Add any additional relations here
    }
  }

  Chat.init(
    {
      userID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Users", // References the Users table
          key: "userID",
        },
      },
      chatroomID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Chatrooms", // References the Chatrooms table
          key: "id",
        },
      },
      // You can add additional fields like:
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userID", "chatroomID"], // Composite primary key
        },
        {
          fields: ["chatroomID"], // For faster queries by chatroom
        },
        {
          fields: ["userID"], // For faster queries by user
        },
      ],
    }
  );

  return Chat;
};
