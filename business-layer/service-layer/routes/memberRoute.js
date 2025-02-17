let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");

// GET /v1/member/:memberId
router.get(
  "/:memberId",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let memberId = req.params.memberId;

    // sanitize and validate memberId
    memberId = sanitizer.sanitize(memberId);
    if (isNaN(memberId)) {
      res.status(400).json({ error: "Must include a valid member ID" });
      return;
    }

    // fetch member data from backend
    const memberData = await business.getMember(memberId);

    if (memberData.error && memberData.error !== error.noError) {
      res.status(404).json({ error: error.memberCannotBeFoundInDB });
      return;
    }

    res.status(200).json({ status: "success", data: memberData.data });
  }
);

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
      res.status(400).json({ error: "Must include a valid member ID" });
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

    res.status(200).json({ status: "success", data: updateResult.data });
  }
);

router.put("/", (req, res) => {
  res.status(400).json({ error: error.mustIncludeMemberId });
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

  res.status(200).json({ status: "success", data: createResult.data });
});

/**
 * GET /v1/member/{memberId}/stats?orgId={orgId}
 * Retrieves member statistics for a specific organization.
 */
router.get(
  "/:memberId/stats",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    // Sanitize input
    let memberId = sanitizer.sanitize(req.params.memberId);
    let orgId = sanitizer.sanitize(req.query.orgId);

    // Validate inputs
    if (!memberId || isNaN(memberId)) {
      return res
        .status(400)
        .json({ error: "Must include a valid member ID in your call" });
    }
    if (!orgId || isNaN(orgId)) {
      return res
        .status(400)
        .json({ error: "Must include a valid org ID in your call" });
    }

    // Fetch member stats for the organization
    const memberStats = await business.getSpecificMemberOrgStats(memberId, orgId);

    // Handle errors from backend
    if (!memberStats) {
      return res
        .status(404)
        .json({ error: `member with id of ${memberId} not found` });
    }
    if (memberStats.error === "org_not_found") {
      return res
        .status(404)
        .json({ error: `org with id of ${orgId} not found` });
    }

    // Return successful response
    res.status(200).json({ status: "success", data: memberStats });
  }
);

module.exports = router;
