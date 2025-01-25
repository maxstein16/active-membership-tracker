let express = require("express");
const router = express.Router();

/*

https://api.rit.edu/v1/organization/{orgId}/settings

*/

// GET /v1/organization/{orgId}/settings
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization Settings Route", org: req.params.orgId });
});

module.exports = router;
