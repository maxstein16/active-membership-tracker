let express = require("express");
const router = express.Router();

/*

https://api.rit.edu/v1/organization/{orgId}/reports

*/

// GET /v1/organization/{orgId}/member
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization Reports Route", org: req.params.orgId });
});

module.exports = router;
