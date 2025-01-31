let express = require("express");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");
const router = express.Router({mergeParams: true});

/*

https://api.rit.edu/v1/organization/{orgId}/settings

*/

// GET /v1/organization/{orgId}/settings
router.get("/", isAuthorizedHasSessionForAPI, function (req, res) {
  res.status(200).json({ message: "Hello Organization Settings Route", org: req.params.orgId });
});

module.exports = router;
