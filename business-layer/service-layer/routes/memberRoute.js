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
 * POST /v1/member/
 * Creates a new member with the provided details.
 */
router.post("/", async function (req, res) {
  let body = req.body;

  // Define required fields for member creation
  const requiredFields = [
    "member_name",
    "member_email",
    "member_personal_email",
    "member_phone_number",
    "member_graduation_date",
    "member_tshirt_size",
    "member_major",
    "member_gender",
    "member_race",
    "role",
  ];

  // Check for missing fields
  const missingFields = requiredFields.filter(
    (field) => !body.hasOwnProperty(field)
  );

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing fields: ${missingFields.join(", ")}` });
  }

  try {
    // Send data to backend for member creation
    const result = await business.addMember(body);

    // Handle backend errors
    if (result.error && result.error !== error.noError) {
      return res.status(404).json({ error: result.error });
    }

    // Return success response
    res.status(201).json({ status: "success", data: result.data });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

/**
 * PUT /v1/member/{memberId}
 * Updates an existing member's details.
 */
router.put("/:memberId", async function (req, res) {
  let memberId = sanitizer.sanitize(req.params.memberId);
  let body = req.body;

  // Validate that memberId is a number
  if (isNaN(memberId)) {
    return res.status(400).json({ error: error.memberIdMustBeInteger });
  }

  // Ensure at least one field is provided for update
  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ error: error.mustHaveAtLeastOneFieldsAddMember });
  }

  // Send update request to backend
  const result = await business.editMember(memberId, body);

  // Handle potential errors
  if (result?.error && result.error !== error.noError) {
    return res.status(500).json({ error: result.error, memberId });
  }

  // Return success response
  res.status(200).json({ status: "success", data: result.data });
});

module.exports = router;
