const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: { ssl: { require: true } },
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: { ssl: { require: true } },
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
    dialectOptions: { ssl: { require: true } },
  },
};
