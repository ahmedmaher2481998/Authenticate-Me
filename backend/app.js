console.clear();
const express = require("express");
const helmet = require("helmet");
const csurf = require("csurf");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/");
require("express-async-errors");
const routes = require("./routes");
const { ValidationError } = require("sequelize");
// start of app
const app = express();
const isProduction = config.environment === "production";
//setting security headers and helpers
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// only in dev env
if (!isProduction) app.use(cors({ origin: "http://localhost:3000" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "lax",
      httpOnly: true,
    },
  })
);
// All Routers
app.use("/", routes);
// 404 catcher
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found .");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});
// error handlers
// process sequelize errors to make it more readable
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((r) => r.message);
    err.title = "Validation Error Sequelize ";
    err.status = 500;
  }
  next(err);
});
app.use((err, req, res, nex) => {
  console.error(err.message);
  const code = err.status || 500;
  console.log(err.status);
  res.status(code).json({
    title: err.title,
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});
module.exports = app;
