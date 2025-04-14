"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TaskDependencies", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      taskId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "taskID",
        },
        onDelete: "CASCADE",
      },
      dependsOnId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "taskID",
        },
        onDelete: "CASCADE",
      },
      dependencyType: {
        type: Sequelize.ENUM(
          "finish_to_start",
          "start_to_start",
          "finish_to_finish",
          "start_to_finish"
        ),
        defaultValue: "finish_to_start",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add constraint to prevent circular dependencies
    await queryInterface.addConstraint("TaskDependencies", {
      fields: ["taskId", "dependsOnId"],
      type: "unique",
      name: "unique_dependency",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TaskDependencies");
  },
};
