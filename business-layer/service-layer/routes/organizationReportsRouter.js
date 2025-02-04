let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");
/*

https://api.rit.edu/v1/organization/{orgId}/reports

*/

// GET /v1/organization/{orgId}/member
router.get("/", isAuthorizedHasSessionForAPI, function (req, res) {
  res.status(200).json({
    message: "Hello Organization Reports Route",
    org: req.params.orgId,
  });
});

// GET /v1/organization/{orgId}/reports/annual
router.get("/annual", isAuthorizedHasSessionForAPI, function (req, res) {
  let orgId = req.params.orgId;

  // sanitize
  orgId = sanitizer.sanitize(orgId);

  // checking
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // send to backend
  const orgData = business.getAnnualOrgReport(orgId);

  // check for errors that backend returned
  if (orgData.error && orgData.error !== error.noError) {
    res.status(404).json({ error: orgData.error, orgId: orgId });
    return;
  }

  res.status(200).json({
    message: "Annual Report " + orgId,
    org: req.params.orgId,
    orgData,
  });
});

// GET /v1/organization/{orgId}/reports/meeting?id={meetingId}
router.get(
  "/meeting?id={meetingId}",
  isAuthorizedHasSessionForAPI,
  function (req, res) {
    let orgId = req.params.orgId;
    let meetingId = req.query.meetingId;

    // sanitize
    orgId = sanitizer.sanitize(orgId);
    meetingId = sanitizer.sanitize(meetingId);

    // checking
    if (isNaN(orgId)) {
      res.status(400).json({ error: error.organizationIdMustBeInteger });
      return;
    }

    if (isNaN(meetingId)) {
      res.status(400).json({ error: error.organizationIdMustBeInteger });
      return;
    }

    // send to backend
    const orgData = business.getMeetingOrgReport(orgId, meetingId);

    // check for errors that backend returned
    if (orgData.error && orgData.error !== error.noError) {
      res
        .status(404)
        .json({ error: orgData.error, orgId: orgId, meetingId: meetingId });
      return;
    }

    res.status(200).json({
      message: "Meeting Report for " + meetingId,
      org: req.params.orgId,
      orgData,
    });
  }
);

module.exports = router;
