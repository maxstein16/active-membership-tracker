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
 */
router.get("/:memberId", async function (req, res) {
  //sanitize
  let memberId = sanitizer.sanitize(req.params.memberId);

  // check if params are valid!
  if (isNaN(memberId)) {
    return res.status(400).json({ error: error.memberIdMustBeInteger });
  }
  // send off to backend
  const memberData = await business.getMemberData(memberId);

  // check for errors that backend returned
  if (memberData?.error && memberData.error !== error.noError) {
    return res.status(404).json({ error: memberData.error, memberId });
  }
  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: memberData.data });
});

/**
 * POST /v1/member/ (Create Member)
 */
router.post("/", async function (req, res) {
  let body = req.body;

  // check if has all the params needed
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

  const missingFields = requiredFields.filter(
    (field) => !body.hasOwnProperty(field)
  );

  if (missingFields.length > 0) {
    res
      .status(400)
      .json({ error: `Missing fields: ${missingFields.join(", ")}` });
    return;
  }

  try {
    // send off to backend
    const result = await business.addMember(body);

    // check for errors that backend returned
    if (result.error && result.error !== error.noError) {
      res.status(404).json({ error: result.error });
      return;
    }

    // return with appropriate status error and message
    res.status(201).json({ status: "success", data: result.data });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

/**
 * PUT /v1/member/{memberId} (Update Member)
 */
router.put("/:memberId", async function (req, res) {
  let memberId = sanitizer.sanitize(req.params.memberId);
  let body = req.body;

  if (isNaN(memberId)) {
    return res.status(400).json({ error: error.memberIdMustBeInteger });
  }

  // Ensure at least one field is provided for an update
  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ error: error.mustHaveAtLeastOneFieldsAddMember });
  }

  const result = await business.editMember(memberId, body);

  if (result?.error && result.error !== error.noError) {
    return res.status(500).json({ error: result.error, memberId });
  }

  res.status(200).json({ status: "success", data: result.data });
});

module.exports = router;
