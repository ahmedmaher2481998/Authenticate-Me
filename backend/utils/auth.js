const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");
const { expiresIn, secret } = jwtConfig;
const setTokenCookie = (res, user) => {
  // create the token
  const token = jwt.sign({ ...user.toSafeObject() }, secret, {
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
// it takes req,res and verify token if auth it adds user to req ,else
// if user didn't exist it clears cookie
const restoreUser = (req, res, next) => {
  // token parsed from cookies

  const { token } = req.cookies;
  return jwt.verify(token, secret, {}, async (err, jwtPayload) => {
    if (err) return next(err);
    try {
      const { id } = jwtPayload;
      req.user = await User.scope("currentUser").findByPk(id);
    } catch (error) {
      res.clearCookie("token");
      next();
    }
    if (!req.user) res.clearCookie("token");
    return next();
  });
};
const requireAuth = [
  restoreUser,
  (req, res, next) => {
    if (req.user) {
      return next();
    } else {
      const err = new Error("Unauthorized");
      err.errors = ["Unauthorized"];
      err.status = 401;
      return next(err);
    }
  },
];

module.exports = { setTokenCookie, restoreUser, requireAuth };
