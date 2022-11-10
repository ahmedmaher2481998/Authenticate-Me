const router = require("express").Router();
const { User } = require("../../db/models");
const {
  jwtConfig: { expiresIn },
} = require("../../config");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { json } = require("sequelize");
const isProduction = process.env.NODE_ENV === "production";
// log in
router.post("/", async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.login({ credential, password });
  if (user) {
    setTokenCookie(res, user);
    res.json(user);
  } else {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = ["Username or password are wrong"];
    next(err);
  }
});
// log out
router.delete("/", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "success" });
});
// Get Session User
router.get("/", restoreUser, (req, res) => {
  const { user = {} } = req;
  res.json({ user });
});

module.exports = router;
