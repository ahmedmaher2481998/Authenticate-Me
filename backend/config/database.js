const config = require("./index");

module.exports = {
  development: {
    // username: "root",
    // password: null,
    // database: process.env.DATABASE_FILE,
    // host: "127.0.0.1",
    Storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },

  production: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        required: true,
        rejectUnauthorized: false,
      },
    },
  },
};
