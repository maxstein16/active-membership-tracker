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

    // For new organizations with no data, still return a 200 with empty data
    if (!orgData.data) {
      console.log(`No annual report data available for org ${orgId}, providing empty data structure`);
      res.status(200).json({
        orgData: {
          organization_id: orgId,
          current_year: new Date().getFullYear(),
          isNewOrg: true,
          memberDataThis: {
            totalMembers: 0,
            newMembers: 0,
            totalActive_members: 0,
            newActive_members: 0,
            members: []
          },
          memberDataLast: null,
          meetingsDataThis: {
            numMeetings: 0,
            numEvents: 0,
            numVolunteering: 0,
            totalAttendance: 0,
            meetings: []
          },
          meetingsDataLast: null
        }
      });
      return;
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

router.get("/annual/:year", isAuthorizedHasSessionForAPI, async function (req, res) {
  try {
    let orgId = req.params.orgId;
    let year = req.params.year;

    // Sanitize inputs
    orgId = sanitizer.sanitize(orgId);
    year = sanitizer.sanitize(year);

    // Validate parameters
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    if (isNaN(year)) {
      return res.status(400).json({ error: error.yearMustBeInteger });
    }

    // Get organization info to check if it existed in the requested year
    try {
      const organization = await business.getOrganization(orgId);
      if (!organization || !organization.data) {
        return res.status(404).json({ error: error.organizationNotFound, orgId: orgId });
      }
      
      const orgCreationDate = new Date(organization.data.createdAt || organization.data.created_at);
      const orgCreationYear = orgCreationDate.getFullYear();
      const requestedYear = parseInt(year, 10);
      
      // If requesting data from before the org existed, return empty data with isNewOrg flag
      if (requestedYear < orgCreationYear) {
        return res.status(200).json({
          orgData: {
            organization_id: orgId,
            current_year: requestedYear,
            isNewOrg: true,
            memberDataThis: {
              totalMembers: 0,
              newMembers: 0,
              totalActive_members: 0,
              newActive_members: 0,
              members: []
            },
            memberDataLast: null,
            meetingsDataThis: {
              numMeetings: 0,
              numEvents: 0,
              numVolunteering: 0,
              totalAttendance: 0,
              meetings: []
            },
            meetingsDataLast: null
          }
        });
      }
    } catch (err) {
      console.error("Error checking organization creation date:", err);
    }

    // Get report data for specific year
    const orgData = await business.getAnnualOrgReportByYear(orgId, parseInt(year, 10));

    // Handle errors
    if (orgData.error && orgData.error !== error.noError) {
      console.error(`Error getting annual report for org ${orgId}, year ${year}:`, orgData.error);
      
      // If no data found, still return a 200 with empty data
      if (orgData.error === error.noSemestersFoundForYear || orgData.error === error.databaseError) {
        return res.status(200).json({
          orgData: {
            organization_id: orgId,
            current_year: parseInt(year, 10),
            isNewOrg: true,
            memberDataThis: {
              totalMembers: 0,
              newMembers: 0,
              totalActive_members: 0,
              newActive_members: 0,
              members: []
            },
            memberDataLast: null,
            meetingsDataThis: {
              numMeetings: 0,
              numEvents: 0,
              numVolunteering: 0,
              totalAttendance: 0,
              meetings: []
            },
            meetingsDataLast: null
          }
        });
      }
      
      return res.status(404).json({ 
        error: orgData.error, 
        orgId: orgId, 
        year: year 
      });
    }

    // Return successful response
    res.status(200).json({
      orgData: orgData.data
    });

  } catch (err) {
    console.error("Error in annual report by year route:", err);
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

// GET /v1/organization/{orgId}/reports/semesterly/:semesterId
router.get("/semesterly/:semesterId", isAuthorizedHasSessionForAPI, async function (req, res) {
  try {
    let orgId = req.params.orgId;
    let semesterId = req.params.semesterId;

    // Sanitize inputs
    orgId = sanitizer.sanitize(orgId);
    semesterId = sanitizer.sanitize(semesterId);

    // Validate parameters
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    if (isNaN(semesterId)) {
      return res.status(400).json({ error: error.semesterIdMustBeInteger });
    }

    // Get report data for specific semester
    const orgData = await business.getSemesterOrgReportBySemesterId(orgId, semesterId);

    // Handle errors
    if (orgData.error && orgData.error !== error.noError) {
      return res.status(404).json({ 
        error: orgData.error, 
        orgId: orgId, 
        semesterId: semesterId 
      });
    }

    // Return successful response
    res.status(200).json({
      orgData: orgData.data
    });

  } catch (err) {
    console.error("Error in semester report by ID route:", err);
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
