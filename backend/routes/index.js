const { application } = require("express");
const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

router.get("/hello/world", (req, res) => {
  res.cookie("XSRF-Token", req.csrfToken());
  res.send("Hello world From the main route... ");
});

module.exports = router;
