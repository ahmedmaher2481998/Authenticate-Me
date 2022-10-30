require("dotenv").config();
module.exports = {
  development: {
    // username: "root",
    // password: null,
    // database: process.env.DATABASE_FILE,
    // host: "127.0.0.1",
    Storage: process.env.DATABASE_FILE,
    dialect: "sqlite",
    logQueryParameters: true,
    typeValidation: true,
    seederStorage: "sequelize",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "sqlite",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "sqlite",
  },
};
