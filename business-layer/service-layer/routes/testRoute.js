let express = require("express");
const router = express.Router();

// GET /test
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Tester" });
});

module.exports = router;
