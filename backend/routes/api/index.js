const { Router } = require("express");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { User } = require("../../db/models");
const router = Router();
const sessionRouter = require("./session");
const userRouter = require("./user");

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});
router.use("/session", sessionRouter);
router.use("/user", userRouter);

router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-Token", req.csrfToken());
  res.status(200).json({ "XSRF-Token": csrfToken });
});
/*
router.get("/set-token-cookie", async (req, res, next) => {
  const user = await User.findOne({ where: { username: "Demo-lition" } });
  setTokenCookie(res, user);
  return res.json({ user });
});
router.get("/restore-user", restoreUser, (req, res, next) => {
  res.json({ user: req.user });
});
router.get("/require-auth", requireAuth, (req, res, next) => {
  res.json(req.user);
});
*/

module.exports = router;
