const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");
const { expiresIn, secret } = jwtConfig;
const setToken = (res, user) => {
  // create the token
  const token = jwt.sign({ payload: user.toSafeObject() }, secret, {
    expiresIn: parseInt(expiresIn), //in one week
  });
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, //maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "lex",
  });
  return token;
};

const restoreUser = (req, res, next) => {
  const { token } = req.cookie;
};

module.exports = { setToken };
