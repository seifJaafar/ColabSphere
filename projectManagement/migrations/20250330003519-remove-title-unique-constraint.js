"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove old unique constraint on "title"
    await queryInterface.removeConstraint("Modules", "Modules_title_key");
  },

  async down(queryInterface, Sequelize) {
    // Restore old unique constraint on "title" if migration is rolled back
    await queryInterface.addConstraint("Modules", {
      fields: ["title"],
      type: "unique",
      name: "Modules_title_key",
    });
  },
};
