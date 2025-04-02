"use strict";
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here (e.g., User.hasMany(models.Post))
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email cannot be empty" },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 30],
            msg: "Username must be between 3 and 30 characters",
          },
          notNull: { msg: "Username is required" },
          notEmpty: { msg: "Username cannot be empty" },
        },
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "Avatar must be a valid URL" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8],
            msg: "Password must be at least 8 characters long",
          },
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password cannot be empty" },
        },
      },
      googleAccessToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      githubAccessToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      githubRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
