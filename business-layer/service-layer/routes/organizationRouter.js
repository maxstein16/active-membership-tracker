let express = require("express");
const router = express.Router();

/*

https://api.rit.edu/v1/organization/{orgId}

*/

// GET /v1/organization/{orgId}
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization", org: req.params.orgId });
});

module.exports = router;
