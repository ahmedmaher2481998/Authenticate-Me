const router = require("express").Router();
const { User } = require("../../db/models");
const { setTokenCookie, restoreUser } = require("../../utils/auth");

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
module.exports = router;
