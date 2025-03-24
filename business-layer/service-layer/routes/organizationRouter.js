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
const hasCredentials = require("../../business-logic-layer/public/hasCredentials.js");

/**
 * Base route /v1/organization/
 * Returns error when no organization ID is provided for methods that require it
 */
router.all("/", isAdminOrEboardForOrg, (req, res) => {
  // POST is allowed without an ID
  if (req.method === "POST") {
    return handlePostOrganization(req, res);
  }

  // All other methods require an ID
  return res.status(400).json({
    status: "error",
    error: error.mustIncludeOrgId,
  });
});

/**
 * GET /v1/organization/my
 * Retrieves organizations that the logged-in user is a member of
 */
router.get("/my", isAuthorizedHasSessionForAPI, async (req, res) => {
    // Fetch member ID using the function
  let memberId = await business.getMemberIDByUsername(req.session.user.username);

  // Check if an error occurred while fetching member ID
  if (memberId.error) {
    console.log("Error fetching member ID: " + memberId.error);
    res.status(404).json({ error: memberId.error });
    return;
  }

    // Call business logic to get user's organizations
    const result = await business.getUserOrganizations(memberId.data);

    if (result.error) {
      return res.status(400).json({
        status: "error",
        error: result.error,
      });
    }

    return res.status(200).json({
      status: "success",
      data: result.data,
    });
});

/**
 * GET /v1/organization/{orgId}
 * Retrieves specific organization data
 */
router.get("/:orgId", isAuthorizedHasSessionForAPI, async (req, res) => {
  try {
    const orgId = sanitizer.sanitize(req.params.orgId);

    if (isNaN(orgId)) {
      return res.status(400).json({
        status: "error",
        error: error.organizationIdMustBeInteger,
      });
    }

    const orgInfo = await business.getSpecificOrgData(parseInt(orgId));

    if (!orgInfo || !orgInfo.data) {
      return res.status(404).json({
        status: "error",
        error: error.organizationNotFound,
      });
    }

    return res.status(200).json({
      status: "success",
      data: orgInfo.data,
    });
  } catch (err) {
    console.error("Error in GET /organization/:", err);
    return res.status(500).json({
      status: "error",
      error: error.somethingWentWrong,
    });
  }
});

/**
 * Handler for creating new organization
 */
async function handlePostOrganization(req, res) {
  try {
    if (
      !req.body.hasOwnProperty("organization_name") ||
      !req.body.hasOwnProperty("organization_abbreviation") ||
      !req.body.hasOwnProperty("organization_description") ||
      !req.body.hasOwnProperty("organization_color") ||
      !req.body.hasOwnProperty("organization_threshold") ||
      !req.body.hasOwnProperty("organization_email") ||
      !req.body.hasOwnProperty("organization_membership_type")
    ) {
      return res.status(400).json({
        status: "error",
        error: error.mustHaveAllFieldsAddOrg,
      }); 
    }

    // Fetch member ID using the function
    let memberId = await business.getMemberIDByUsername(
      req.session.user.username
    );

    // Check if an error occurred while fetching member ID
    if (memberId.error) {
      console.log("Error fetching member ID: " + memberId.error + " in order to add them to admin");
      res.status(404).json({ error: memberId.error });
      return;
    }

    const result = await business.createOrganization(req.body, memberId.data);

    if (result.error) {
      return res.status(400).json({
        status: "error",
        error: result.error,
      });
    }

    return res.status(201).json({
      status: "success",
      data: result.data,
    });
  } catch (err) {
    console.error("Error in POST /organization/:", err);
    return res.status(500).json({
      status: "error",
      error: error.somethingWentWrong,
    });
  }
}

/**
 * PUT /v1/organization/{orgId}
 * Updates an existing organization
 */
router.put("/:orgId", isAdminOrEboardForOrg, async (req, res) => {
  try {
    const orgId = sanitizer.sanitize(req.params.orgId);

    if (isNaN(orgId)) {
      return res.status(400).json({
        status: "error",
        error: error.organizationIdMustBeInteger,
      });
    }

    if (
      !req.body.hasOwnProperty("organization_name") &&
      !req.body.hasOwnProperty("organization_abbreviation") &&
      !req.body.hasOwnProperty("organization_description") &&
      !req.body.hasOwnProperty("organization_color") &&
      !req.body.hasOwnProperty("organization_threshold") &&
      !req.body.hasOwnProperty("organization_email") &&
      !req.body.hasOwnProperty("organization_membership_type")
    ) {
      return res.status(400).json({
        status: "error",
        error: "Must have one valid field",
      });
    }

    console.log(orgId)
    const result = await business.updateOrganization(orgId, req.body);

    if (result.error) {
      return res.status(404).json({
        status: "error",
        error: result.error,
      });
    }

    return res.status(200).json({
      status: "success",
      data: result.data,
    });
  } catch (err) {
    console.error("Error in PUT /organization/:", err);
    return res.status(500).json({
      status: "error",
      error: error.somethingWentWrong,
    });
  }
});

module.exports = router;
