"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.Project, {
        foreignKey: "projectID",
        onDelete: "CASCADE",
      });
    }
  }
  Task.init(
    {
      taskID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "not_started",
          "in_progress",
          "completed",
          "delayed",
          "cancelled"
        ),
        defaultValue: "not_started",
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: true,
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      finishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      projectID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Projects", // Referencing 'Projects' model for projectId
          key: "id",
        },
      },
      module: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Task",
      timestamps: true,
    }
  );
  return Task;
};
