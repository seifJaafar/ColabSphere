"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      taskID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM("easy", "medium", "hard"),
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high"),
        allowNull: true,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      finishedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      projectID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Projects", // Referencing 'Projects' model for projectId
          key: "id",
        },
      },
      module: {
        type: Sequelize.STRING,
        allowNull: true,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
