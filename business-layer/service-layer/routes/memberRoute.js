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

module.exports = router;
