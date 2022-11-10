const router = require("express").Router();
const { User } = require("./../../db/models");
const { setTokenCookie, requireAuth } = require("./../../utils/auth");
const {
  validationErrorHandler,
} = require("../../utils/validationErrorHandler");
const { check } = require("express-validator");
router.get("/", async (req, res, next) => {
  const users = await User.scope("currentUser").findAll();
  res.json({ users });
});
const signUpValidator = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("username is required"),
  check("username")
    .isLength({ min: 4 })
    .withMessage("username must be more than 4 char long"),
  check("username").not().isEmail().withMessage("username can't be an email"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("password is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("password must be more than 6 chars long"),

  check("email").exists({ checkFalsy: true }).withMessage("email is required"),
  check("email").isEmail().withMessage("invalid email"),
  validationErrorHandler,
];
router.post("/", signUpValidator, async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.signUp({ username, email, password });
    setTokenCookie(res, user);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
