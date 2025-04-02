"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      Team.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
    }
  }

  Team.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true, // Part of the composite primary key
        allowNull: false,
      },
      projectId: {
        type: DataTypes.UUID,
        primaryKey: true, // Part of the composite primary key
        allowNull: false,
        references: {
          model: "Projects", // Referencing 'Projects' model for projectId
          key: "id",
        },
        onDelete: "CASCADE", // Ensures deletion when the related project is deleted
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: ["member"], // Default role is 'member'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Team",
      tableName: "team", // Correctly reference the table name
      timestamps: true, // Automatically manage createdAt and updatedAt
    }
  );

  return Team;
};
