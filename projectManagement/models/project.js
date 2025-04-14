"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Defining the hasMany association with Team
      Project.hasMany(models.Team, {
        foreignKey: "projectId",
        as: "teams", // Alias to use in eager loading
        onDelete: "CASCADE",
      });
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // PostgreSQL UUID generation
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending", // Default value for status
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      finishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      driveurl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      calendarurl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Project",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["ownerID", "title"], // Add unique constraint at the model level
        },
      ], // This will automatically add createdAt and updatedAt
    }
  );

  return Project;
};
