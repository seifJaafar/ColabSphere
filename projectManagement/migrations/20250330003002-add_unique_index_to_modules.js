"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("Modules", ["title", "projectID"], {
      unique: true,
      name: "unique_title_projectid",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Modules", "unique_title_projectid");
  },
};
