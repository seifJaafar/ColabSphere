const { Sequelize } = require("sequelize");
const dbConfig = require("./config.js"); // Adjust path if needed

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// Initialize Sequelize with database config
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false, // Set to true if you want SQL query logs
  }
);

module.exports = sequelize;
