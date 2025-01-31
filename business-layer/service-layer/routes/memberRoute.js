let express = require("express");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");
const router = express.Router();

/*

https://api.rit.edu/v1/member

*/

// GET /v1/member
router.get("/", isAuthorizedHasSessionForAPI, function (req, res) {
  res.status(200).json({ message: "Hello Member" });
});

module.exports = router;
