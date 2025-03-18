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

// GET /v1/organization/{orgId}/reports/event/:eventId
router.get(
  "/event/:eventId",
  isAdminOrEboardForOrg,
  async function (req, res) {
    try {
      let orgId = req.params.orgId;
      let eventId = req.params.eventId;

      // Sanitize inputs
      orgId = sanitizer.sanitize(orgId);
      eventId = sanitizer.sanitize(eventId);

      // Validate parameters
      if (isNaN(orgId)) {
        return res
          .status(400)
          .json({ error: error.organizationIdMustBeInteger });
      }

      if (isNaN(eventId)) {
        return res.status(400).json({ error: error.eventIdMustBeInteger });
      }

      // Get report data
      const orgData = await business.getEventOrgReport(orgId, eventId);

      // Handle errors
      if (orgData.error && orgData.error !== error.noError) {
        return res.status(404).json({
          error: orgData.error,
          orgId: orgId,
          eventId: eventId,
        });
      }

      // Return successful response
      res.status(200).json({
        orgData: orgData.data,
      });
    } catch (err) {
      console.error("Error in event report route:", err);
      res.status(500).json({ error: error.internalServerError });
    }
  }
);

module.exports = router;
