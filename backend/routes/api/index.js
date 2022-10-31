const { Router } = require("express");
const router = Router();
router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});
router.get("/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-Token", req.csrfToken());
  res.status(200).json({ "XSRF-Token": csrfToken });
});
module.exports = router;
