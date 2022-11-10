const router = require("express").Router();
const { User } = require("./../../db/models");
const { setTokenCookie, requireAuth } = require("./../../utils/auth");
router.get("/", async (req, res, next) => {
  const users = await User.scope("currentUser").findAll();
  res.json({ users });
});
router.post("/", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log("Body", req.body);
  try {
    const user = await User.signUp({ username, email, password });
    setTokenCookie(res, user);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
