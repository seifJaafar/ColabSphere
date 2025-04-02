"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the foreign key constraint to the 'team' table
    await queryInterface.addConstraint("team", {
      fields: ["projectId"], // The column in the 'team' table that we want to add a foreign key to
      type: "foreign key",
      name: "team_projectId_fk", // Name for the foreign key constraint
      references: {
        table: "Projects", // The table we are referencing
        field: "id", // The column in the 'Projects' table
      },
      onDelete: "CASCADE", // Ensures related rows in 'team' are deleted when the corresponding project is deleted
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint if rolling back the migration
    await queryInterface.removeConstraint("team", "team_projectId_fk");
  },
};
