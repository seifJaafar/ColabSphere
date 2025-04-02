"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("team", {
      userId: {
        type: Sequelize.UUID, // Store user ID as UUID or string
        allowNull: false,
      },
      projectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Projects", // Referencing 'Projects' model for projectId
          key: "id",
        },
        onDelete: "CASCADE",
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roles: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: ["member"], // Default role is 'member'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Set the combination of `userId` and `projectId` as the primary key
    await queryInterface.addConstraint("team", {
      fields: ["userId", "projectId"],
      type: "primary key",
      name: "team_pk", // Name of the constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("team");
  },
};
