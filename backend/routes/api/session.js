const router = require("express").Router(),
  { User } = require("../../db/models"),
  {
    jwtConfig: { expiresIn },
  } = require("../../config"),
  { setTokenCookie, restoreUser } = require("../../utils/auth"),
  isProduction = process.env.NODE_ENV === "production",
  { check } = require("express-validator"),
  { validationErrorHandler } = require("../../utils/validationErrorHandler");

const logInValidator = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide Username Or Password"),
  check("password")
    .notEmpty()
    .exists({ checkFalsy: true })
    .withMessage("please provide a valid password"),
  validationErrorHandler,
];
// log in
router.post("/", logInValidator, async (req, res, next) => {
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
