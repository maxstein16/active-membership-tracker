let express = require("express");
const router = express.Router();

/*

https://api.rit.edu/v1/organization/{orgId}/member

*/

// GET /v1/organization/{orgId}/member
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization Member Route", org: req.params.orgId });
});

module.exports = router;
