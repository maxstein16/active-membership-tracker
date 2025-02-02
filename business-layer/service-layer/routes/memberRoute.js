let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

/**
 * GET /v1/member/{memberId}
 * Retrieves member data by their unique ID.
 */
router.get("/:memberId", async function (req, res) {
  // Sanitize the input
  let memberId = sanitizer.sanitize(req.params.memberId);

  // Validate that memberId is a number
  if (isNaN(memberId)) {
    return res.status(400).json({ error: error.memberIdMustBeInteger });
  }

  // Fetch member data from backend
  const memberData = await business.getMemberData(memberId);

  // Handle potential errors from backend
  if (memberData?.error && memberData.error !== error.noError) {
    return res.status(404).json({ error: memberData.error, memberId });
  }

  // Return successful response
  res.status(200).json({ status: "success", data: memberData.data });
});

/**
 * GET /v1/member/{memberId}/stats?orgId={orgId}
 * Retrieves member statistics for a specific organization.
 */
router.get("/:memberId/stats", async function (req, res) {
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
  const memberStats = await business.getMemberStats(memberId, orgId);

  // Handle errors from backend
  if (!memberStats) {
    return res
      .status(404)
      .json({ error: `member with id of ${memberId} not found` });
  }
  if (memberStats.error === "org_not_found") {
    return res.status(404).json({ error: `org with id of ${orgId} not found` });
  }

  // Return successful response
  res.status(200).json({ status: "success", data: memberStats });
});
module.exports = router;
