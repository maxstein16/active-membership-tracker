let express = require("express");
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
} = require("../../sessionMiddleware.js");
const hasCredentials = require("../../business-logic-layer/public/hasCredentials.js");
/*

https://api.rit.edu/v1/organization/{orgId}/member

*/

// GET /v1/organization/{orgId}/member/{memberId}
router.get(
  "/:memberId",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
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
    const memberData = await business.getSpecificMemberWithOrgData(
      orgId,
      memberId
    );

    // check for errors that backend returned
    if (memberData.error && memberData.error !== error.noError) {
      res
        .status(404)
        .json({ error: memberData.error, memberId: memberId, orgId: orgId });
      return;
    }

    // return with appropriate status error and message
    res.status(200).json({ status: "success", data: memberData.data });
  }
);

// POST /v1/organization/{orgId}/member
router.post("/", isAdminOrEboardForOrg, async function (req, res) {
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
  if (!body.hasOwnProperty("member_id") || !body.hasOwnProperty("role")) {
    res.status(400).json({ error: error.mustHaveAllFieldsAddMemberInOrg });
    return;
  }

  // send off to backend
  const result = await business.addMemberToAnOrganization(orgId, body);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

// PUT /v1/organization/{orgId}/member/{memberId}
router.put("/:memberId", isAdminOrEboardForOrg, async function (req, res) {
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

  // check if has all the params needed
  if (
    !body.hasOwnProperty("role") &&
    !body.hasOwnProperty("membership_points")
  ) {
    res
      .status(400)
      .json({ error: error.mustHaveAtLeastOneFieldsAddMemberInOrg });
    return;
  }

  // send off to backend
  const result = await business.editMemberInOrganization(orgId, memberId, body);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res
      .status(404)
      .json({ error: result.error, orgId: orgId, memberId: memberId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

// DELETE /v1/organization/{orgId}/member/{memberId}
router.delete("/:memberId", isAdminOrEboardForOrg, async function (req, res) {
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
  const result = await business.deleteMemberInOrganization(orgId, memberId);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res
      .status(404)
      .json({ error: result.error, orgId: orgId, memberId: memberId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

// GET /v1/organization/{orgId}/member
router.get("/", isAuthorizedHasSessionForAPI, async function (req, res) {
  let orgId = req.params.orgId;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // Send off to backend
  const result = await business.getMembersInOrganization(orgId);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status and message
  res
    .status(200)
    .json({ status: "success", data: result.data, count: result.data.length });
});

module.exports = router;
