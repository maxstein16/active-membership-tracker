let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanatizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanatizer();

/*

https://api.rit.edu/v1/organization/{orgId}/member

*/

// GET /v1/organization/{orgId}/member
router.get("/", function (req, res) {
  res.status(400).json({
    error:
      "Must Include a member id as part of the url, for example: member/123",
    org: req.params.orgId,
  });
});

// GET /v1/organization/{orgId}/member/{memberId}
router.get("/:memberId", async function (req, res) {
  let orgId = req.params.orgId;
  let memberId = req.params.memberId;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);
  memberId = sanitizer.sanitize(memberId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }
  if (isNaN(memberId)) {
    res.status(400).json({ error: error.memberIdMustBeInteger });
    return;
  }

  // send off to backend
  const memberData = await business.getSpecificMemberOrgData(orgId, memberId);

  // check for errors that backend returned
  if (memberData.error && memberData.error !== error.noError) {
    res.status(404).json({ error: memberData.error, memberId: memberId, orgId: orgId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: memberData.data });
});

// POST /v1/organization/{orgId}/member
router.post("/", async function (req, res) {
  let orgId = req.params.orgId;
  let body = req.body;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // check if has all the params needed
  if (
    !body.hasOwnProperty("member_name") ||
    !body.hasOwnProperty('member_email') ||
    !body.hasOwnProperty('member_personal_email') ||
    !body.hasOwnProperty('member_phone_number') ||
    !body.hasOwnProperty('member_graduation_date') ||
    !body.hasOwnProperty('member_tshirt_size') ||
    !body.hasOwnProperty('member_major') ||
    !body.hasOwnProperty('member_gender') ||
    !body.hasOwnProperty('member_race') ||
    !body.hasOwnProperty('role')
  ) {
    res.status(400).json({ error: error.mustHaveAllFieldsAddMemberInOrg });
    return;
  }

  // send off to backend
  const result = business.addMemberToOrg(orgId, body)

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});


// PUT /v1/organization/{orgId}/member/{memberId}
router.put("/:memberId", async function (req, res) {
  let orgId = req.params.orgId;
  let memberId = req.params.memberId;
  let body = req.body;

  // sanatize params
  orgId = sanitizer.sanitize(orgId);
  memberId = sanitizer.sanitize(memberId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }
  if (isNaN(memberId)) {
    res.status(400).json({ error: error.memberIdMustBeInteger });
    return;
  }

  // check if has all the params needed
  if (
    !body.hasOwnProperty("member_name") &&
    !body.hasOwnProperty('member_email') &&
    !body.hasOwnProperty('member_personal_email') &&
    !body.hasOwnProperty('member_phone_number') &&
    !body.hasOwnProperty('member_graduation_date') &&
    !body.hasOwnProperty('member_tshirt_size') &&
    !body.hasOwnProperty('member_major') &&
    !body.hasOwnProperty('member_gender') &&
    !body.hasOwnProperty('member_race') &&
    !body.hasOwnProperty('role')
  ) {
    res.status(400).json({ error: error.mustHaveAtLeastOneFieldsAddMemberInOrg });
    return;
  }

  // send off to backend
  const result = business.editMemberInOrg(orgId, memberId, body)

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId, memberId: memberId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});


// DELETE /v1/organization/{orgId}/member/{memberId}
router.delete("/:memberId", async function (req, res) {
  let orgId = req.params.orgId;
  let memberId = req.params.memberId;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);
  memberId = sanitizer.sanitize(memberId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }
  if (isNaN(memberId)) {
    res.status(400).json({ error: error.memberIdMustBeInteger });
    return;
  }

  // send off to backend
  const result = business.deleteMemberInOrg(orgId, memberId)

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId, memberId: memberId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

// GET /v1/organization/{orgId}/members
router.get("/", async function (req, res) {
  let orgId = req.params.orgId;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // Send off to backend
  const result = await business.getMembersInOrg(orgId);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status and message
  res.status(200).json({ status: "success", data: result.data, count: result.data.length });
});

// PUT /v1/organization/{orgId}/member/{memberId}/attendance
router.put("/:memberId/attendance", async function (req, res) {
  let orgId = req.params.orgId;
  let memberId = req.params.memberId;
  let body = req.body;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);
  memberId = sanitizer.sanitize(memberId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }
  if (isNaN(memberId)) {
    res.status(400).json({ error: error.memberIdMustBeInteger });
    return;
  }

  // check if at least one valid field is provided
  if (
    !body.hasOwnProperty("meetings_attended") &&
    !body.hasOwnProperty("volunteer_events") &&
    !body.hasOwnProperty("social_events")
  ) {
    res.status(400).json({ error: error.memberMustEditAttendanceField });
    return;
  }

  // send off to backend
  const result = await business.updateMemberAttendanceInOrg(orgId, memberId, body);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId, memberId: memberId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

module.exports = router;