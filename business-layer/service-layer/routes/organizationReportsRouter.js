const express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const {
  isAuthorizedHasSessionForAPI,
  isAdminOrEboardForOrg,
} = require("../sessionMiddleware");

// GET /v1/organization/{orgId}/reports/annual
router.get("/annual", isAdminOrEboardForOrg, async function (req, res) {
  try {
    let orgId = req.params.orgId;

    // Sanitize inputs
    orgId = sanitizer.sanitize(orgId);

    // Validate parameters
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    // Get report data
    const orgData = await business.getAnnualOrgReport(orgId);

    // Handle errors
    if (orgData.error && orgData.error !== error.noError) {
      return res.status(404).json({ error: orgData.error, orgId: orgId });
    }

    // Return successful response without error field
    res.status(200).json({
      orgData: orgData.data,
    });
  } catch (err) {
    console.error("Error in annual report route:", err);
    res.status(500).json({ error: error.internalServerError });
  }
});

// GET /v1/organization/{orgId}/reports/semesterly
router.get("/semesterly", isAdminOrEboardForOrg, async function (req, res) {
  try {
    let orgId = req.params.orgId;

    // Sanitize inputs
    orgId = sanitizer.sanitize(orgId);

    // Validate parameters
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    // Get report data
    const orgData = await business.getSemesterOrgReport(orgId);

    // Handle errors
    if (orgData.error && orgData.error !== error.noError) {
      return res.status(404).json({ error: orgData.error, orgId: orgId });
    }

    // Return successful response
    res.status(200).json({
      orgData: orgData.data,
    });
  } catch (err) {
    console.error("Error in semester report route:", err);
    res.status(500).json({ error: error.internalServerError });
  }
});

// GET /v1/organization/{orgId}/reports/meeting/:meetingId
router.get(
  "/meeting/:meetingId",
  isAdminOrEboardForOrg,
  async function (req, res) {
    try {
      let orgId = req.params.orgId;
      let meetingId = req.params.meetingId;

      // Sanitize inputs
      orgId = sanitizer.sanitize(orgId);
      meetingId = sanitizer.sanitize(meetingId);

      // Validate parameters
      if (isNaN(orgId)) {
        return res
          .status(400)
          .json({ error: error.organizationIdMustBeInteger });
      }

      if (isNaN(meetingId)) {
        return res.status(400).json({ error: error.meetingIdMustBeInteger });
      }

      // Get report data
      const orgData = await business.getMeetingOrgReport(orgId, meetingId);

      // Handle errors
      if (orgData.error && orgData.error !== error.noError) {
        return res.status(404).json({
          error: orgData.error,
          orgId: orgId,
          meetingId: meetingId,
        });
      }

      // Return successful response
      res.status(200).json({
        orgData: orgData.data,
      });
    } catch (err) {
      console.error("Error in meeting report route:", err);
      res.status(500).json({ error: error.internalServerError });
    }
  }
);

module.exports = router;
