const { application } = require("express");
const express = require("express");
const router = express.Router();
router.get("/hello/world", (req, res) => {
  res.cookie("XSRF-Token", req.csrfToken());
  res.send("Hello world ");
});
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-Token", req.csrfToken());
  res.status(200).json({ "XSRF-Token": csrfToken });
});
module.exports = router;
