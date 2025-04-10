const express = require("../express");

const router = express.Router();

const router2 = express.Router();

router2.use("/new", (req, res, next) => {
  res.end("user list new");
});

router.use("/list", router2);

router.use("/add", (req, res, next) => {
  res.end("user add");
});

router.use("/remove", (req, res, next) => {
  res.end("user remove");
});

module.exports = router;
