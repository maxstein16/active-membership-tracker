let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");
const hasCredentials = require("../../business-logic-layer/public/hasCredentials.js");

/* https://api.rit.edu/v1/organization/{orgId} */

// GET /v1/organization/{orgId}
router.get("/", isAuthorizedHasSessionForAPI, async function (req, res) {
  //sanitize
  let orgId = req.params.orgId;

  orgId = sanitizer.sanitize(req.params.orgId);

  //checking if params are valid
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  //send off to backend
  var orgInfo = await business.getSpecificOrgData(orgId);

  // Handle errors from data returned from backend
  if (orgInfo.error && orgInfo.error !== error.noError) {
    res.status(404).json({ error: orgId.error, orgId: orgId });
    return;
  }

  //return data
  return res.status(200).json({ status: "success", data: orgInfo.data });
});

// POST /v1/organization/
router.post("/", isAuthorizedHasSessionForAPI, async function (req, res) {
  let orgId = req.params.orgId;
  let body = req.body;

  orgId = sanitizer.sanitize(req.params.orgId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // check if has all the params needed
  if (
    !body.hasOwnProperty("organization_name") ||
    !body.hasOwnProperty("organization_abbreviation") ||
    !body.hasOwnProperty("organization_desc") ||
    !body.hasOwnProperty("organization_color") ||
    !body.hasOwnProperty("active_membership_threshold")
  ) {
    res.status(400).json({ error: error.mustHaveAllFieldsAddOrg });
    return;
  }

  // does the user have privileges?
  // const hasPrivileges = hasCredentials.isAdmin(
  //   req.session.user.username,
  //   orgId
  // );
  // if (!hasPrivileges) {
  //   res.status(401).json({ error: error.youDoNotHavePermission });
  // }

  //send off to backend
  var result = await business.addOrganization(orgId, body);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

//PUT /v1/organization/{orgId}
router.put("/", isAuthorizedHasSessionForAPI, async function (req, res) {
  //sanitize
  let orgId = req.params.orgId;
  let body = req.body;

  orgId = sanitizer.sanitize(req.params.orgId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // check if has all the params needed
  if (
    !body.hasOwnProperty("organization_name") ||
    !body.hasOwnProperty("organization_abbreviation") ||
    !body.hasOwnProperty("organization_desc") ||
    !body.hasOwnProperty("organization_color") ||
    !body.hasOwnProperty("active_membership_threshold")
  ) {
    res.status(400).json({ error: error.mustHaveAllFieldsAddOrg });
    return;
  }

  // does the user have privileges?
  // const hasPrivileges = hasCredentials.isEboardOrAdmin(
  //   req.session.user.username,
  //   orgId
  // );
  // if (!hasPrivileges) {
  //   res.status(401).json({ error: error.youDoNotHavePermission });
  // }

  //send off to backend
  var result = await business.editOrganization(orgId, body);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

module.exports = router;
