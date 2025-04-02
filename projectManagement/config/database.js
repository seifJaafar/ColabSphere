const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const dbConfig = require("./config.js"); // Ensure this is the correct path
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const sequelize = new Sequelize(config.url, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Add this if you get SSL errors
    },
  },
  logging: false, // Set to true if you want SQL logs
});

module.exports = sequelize;
