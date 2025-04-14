"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chats", {
      userID: {
        type: Sequelize.STRING,
        primaryKey: true, // Part of composite key
        allowNull: false,
      },
      chatroomID: {
        type: Sequelize.UUID,
        primaryKey: true, // Part of composite key
        allowNull: false,
        references: {
          model: "chatrooms", // References the chatroom table
          key: "id", // References chatroom's UUID
        },
        onDelete: "CASCADE", // Optional: Delete chats if chatroom is deleted
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Optional: Add index for faster queries on chatroomID
    await queryInterface.addIndex("chats", ["chatroomID"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("chats");
  },
};
