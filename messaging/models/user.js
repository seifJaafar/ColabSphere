"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associations can be defined here
      User.hasMany(models.Chat, {
        foreignKey: "userID",
        as: "chats",
      });
    }
  }

  User.init(
    {
      userID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      indexes: [
        {
          fields: ["username"],
        },
      ],
    }
  );

  return User;
};
