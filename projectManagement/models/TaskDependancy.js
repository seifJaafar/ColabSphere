// models/TaskDependency.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskDependency extends Model {
    static associate(models) {
      TaskDependency.belongsTo(models.Task, {
        foreignKey: "taskId",
        as: "task",
        onDelete: "CASCADE",
      });
      TaskDependency.belongsTo(models.Task, {
        foreignKey: "dependsOnId",
        as: "dependsOn",
        onDelete: "CASCADE",
      });
    }
  }
  TaskDependency.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "taskID",
        },
      },
      dependsOnId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "taskID",
        },
      },
      dependencyType: {
        type: DataTypes.ENUM(
          "finish_to_start",
          "start_to_start",
          "finish_to_finish",
          "start_to_finish"
        ),
        defaultValue: "finish_to_start",
      },
    },
    {
      sequelize,
      modelName: "TaskDependency",
      timestamps: true,
    }
  );
  return TaskDependency;
};
