let express = require("express");
const router = express.Router();

// GET /test
const getTestRoute = (req, res) => {
  res.status(200).json({ message: "Hello Tester" });
};

router.get("/", getTestRoute);

module.exports = { router, getTestRoute };
