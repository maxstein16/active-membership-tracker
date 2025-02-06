let express = require("express");
const router = express.Router({mergeParams: true});

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanatizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanatizer();

/*

https://api.rit.edu/v1/organization/{orgId}/reports

*/

// GET /v1/organization/{orgId}/member
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization Reports Route", org: req.params.orgId });
});

//GET /v1/organization/{orgId}/annual-report
router.get("/annual-report", function (req, res) {
  let orgId = req.params.orgId;

  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }
  

  res.status(200).json({ message: "Hello Organization Reports Route", org: req.params.orgId });
});

//GET /v1/organization/{orgId}/meeting-report?id={meetingId}
router.get("/meeting-report", function (req, res) {
  let orgId = req.params.orgId;

  let meetingId = req.params.meetingId;

  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }
  if (isNaN(meetingId)) {
    res.status(400).json({ error: error.meetingIdMustBeInteger });
    return;
  }

  res.status(200).json({ message: "Hello Organization Reports Route", org: req.params.orgId });
});

module.exports = router;
