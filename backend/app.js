console.clear();
const express = require("express");
const helmet = require("helmet");
const csurf = require("csurf");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/");
require("express-async-errors");
const test = require("./routes");
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
app.use("/", test);
module.exports = app;
