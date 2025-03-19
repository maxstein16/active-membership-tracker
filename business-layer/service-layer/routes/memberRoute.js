let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");

const { Member } = require("../../db");

// GET /v1/member/:memberId
router.get(
  "/:memberId",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    // check if memberId is provided

    if (!req.params.memberId) {
      res.status(400).json({ error: error.mustIncludeMemberId });
      return;
    }

    let memberId = req.params.memberId;

    // sanitize and validate memberId
    memberId = sanitizer.sanitize(memberId);
    if (isNaN(memberId)) {
      res.status(400).json({ error: error.mustIncludeValidMemberId });
      return;
    }

    // fetch member data from backend
    const memberData = await business.getMemberById(memberId);

    if (memberData.error && memberData.error !== error.noError) {
      res.status(404).json({ error: error.memberCannotBeFoundInDB });
      return;
    }

    res.status(200).json({ data: memberData.data });
  }
);


// Handle GET requests without memberId
router.get("/", isAuthorizedHasSessionForAPI, async (req, res) => {

  // Fetch member ID using the function
  let memberId = await business.getMemberIDByUsernameInDB(req.session.user.username);

  // Check if an error occurred while fetching member ID
  if (memberId.error) {
    res.status(404).json({ error: memberId.error });
    return;
  }

  console.log("Session user username is " + req.session.user.username);
  console.log("Member ID is " + memberId.data); // Accessing the member ID from the 'data' field

  // Fetch member data using the ID
  const memberData = await business.getMemberById(memberId.data);

  // Check if an error occurred while fetching member data
  if (memberData.error && memberData.error !== error.noError) {
    res.status(404).json({ error: error.memberCannotBeFoundInDB });
    return;
  }

  // Return member data
  res.status(200).json({ data: memberData.data });
});


// PUT /v1/member/:memberId
router.put(
  "/:memberId",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let memberId = req.params.memberId;
    let body = req.body;

    // sanitize and validate memberId
    memberId = sanitizer.sanitize(memberId);
    if (isNaN(memberId)) {
      res.status(400).json({ error: error.mustIncludeValidMemberId });
      return;
    }

    // check if at least one valid field is provided for update
    const allowedFields = [
      "email",
      "personal_email",
      "phone_number",
      "gender",
      "race",
      "tshirt_size",
      "major",
      "graduation_date",
      "status",
    ];
    const hasValidFields = Object.keys(body).some((key) =>
      allowedFields.includes(key)
    );

    if (!hasValidFields) {
      res.status(400).json({
        error: error.mustIncludeValidFieldAddMember,
      });
      return;
    }

    // send data to backend for update
    const updateResult = await business.updateMember(memberId, body);

    if (updateResult.error && updateResult.error !== error.noError) {
      res.status(404).json({ error: error.memberCannotBeFoundInDB });
      return;
    }

    res.status(200).json({ data: updateResult.data });
  }
);

// PUT-UPDATE/v1/member
router.put("/", isAuthorizedHasSessionForAPI, async (req, res) => {
  let body = req.body;
  let memberId = await business.getMemberIDByUsernameInDB(req.session.user.username);

  // Check if an error occurred while fetching member ID
  if (memberId.error) {
    res.status(404).json({ error: memberId.error });
    return;
  }
  // check if at least one valid field is provided for update
  const allowedFields = [
    "personal_email",
    "phone_number",
    "gender",
    "race",
    "tshirt_size",
    "major",
    "graduation_date",
    "status",
  ];

  const hasValidFields = Object.keys(body).some((key) =>
    allowedFields.includes(key)
  );

  if (!hasValidFields) {
    res.status(400).json({
      error: error.mustIncludeValidFieldAddMember,
    });
    return;
  }
  // send data to backend for update
  const updateResult = await business.updateMember(memberId.data, body);

  if (updateResult.error && updateResult.error !== error.noError) {
    res.status(404).json({ error: error.memberCannotBeFoundInDB });
    return;
  }

  res.status(200).json({ data: updateResult.data });

});

// POST /v1/member
router.post("/", isAuthorizedHasSessionForAPI, async function (req, res) {
  let body = req.body;

  // validate required fields
  const requiredFields = [
    "name",
    "email",
    "personal_email",
    "phone_number",
    "graduation_date",
    "tshirt_size",
    "major",
    "gender",
    "race",
    "status",
  ];

  const missingFields = requiredFields.filter(
    (field) => !body.hasOwnProperty(field)
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      error: error.mustIncludeValidFieldAddMember,
    });
    return;
  }

  // send data to backend for creation
  const createResult = await business.createMember(body);

  if (createResult.error && createResult.error !== error.noError) {
    res.status(400).json({ error: createResult.error });
    return;
  }

  res.status(200).json({ data: createResult.data });
});

/**
 * GET /v1/member/{memberId}/stats?orgId={orgId}
 * Retrieves member statistics for a specific organization.
 */
router.get(
  "/:memberId/stats",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    // Immediately check for orgId query parameter
    if (!req.query.orgId) {
      return res.status(400).json({
        error: error.mustIncludeOrgId
      });
    }

    // Rest of the validation and processing
    let memberId = sanitizer.sanitize(req.params.memberId);
    var orgId = sanitizer.sanitize(req.query.orgId);

    if (isNaN(memberId)) {
      return res.status(400).json({
        error: error.mustIncludeValidMemberId
      });
    }

    // Validate organization ID
    if (isNaN(orgId)) {
      return res.status(400).json({
        error: error.mustIncludeValidOrgId
      });
    }

    // Fetch member stats for the organization
    const memberStats = await business.getSpecificMemberOrgStats(memberId, orgId);

    if (memberStats.error) {
      return res.status(404).json({
        error: memberStats.error
      });
    }

    // Return successful response
    return res.status(200).json({
      data: memberStats
    });
  }
);


module.exports = router;
