console.clear();
const express = require("express");
const helmet = require("helmet");
const csurf = require("csurf");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/");
require("express-async-errors");

const app = express();
const isProduction = "production" === config.environment;
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: isProduction ? "productionUrl" : "http://localhost:8000",
  })
);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
