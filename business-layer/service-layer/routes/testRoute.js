const express = require("express");
const router = express.Router();

// GET /test
router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello Tester" });
});

module.exports = router;
