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
/*

https://api.rit.edu/v1/organization/{orgId}/recognitions

*/

// GET /v1/organization/{orgId}/recognitions
router.get("/", isAuthorizedHasSessionForAPI, async function (req, res) {
  let orgId = req.params.orgId;

  // sanitize params
  orgId = sanitizer.sanitize(orgId);

  // check if params are valid!
  if (isNaN(orgId)) {
    res.status(400).json({ error: error.organizationIdMustBeInteger });
    return;
  }

  // send off to backend
  const result = await business.getAllOrgRecognitions(orgId);

  // check for errors that backend returned
  if (result.error && result.error !== error.noError) {
    res.status(404).json({ error: result.error, orgId: orgId });
    return;
  }

  // return with appropriate status error and message
  res.status(200).json({ status: "success", data: result.data });
});

// GET /v1/organization/{orgId}/recognitions/{memberId}
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
    const result = await business.getSpecificRecognition(orgId, memberId);

    // check for errors that backend returned
    if (result.error && result.error !== error.noError) {
      res
        .status(404)
        .json({ error: result.error, orgId: orgId, memberId: memberId });
      return;
    }

    // return with appropriate status error and message
    res.status(200).json({ status: "success", data: result.data });
  }
);

// PUT /v1/organization/{orgId}/recognitions/{memberId}
router.put(
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

    // must have membership_years
    if (!body.hasOwnProperty("membership_years")) {
      res.status(400).json({ error: error.mustHaveMembershipYearsField });
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

    // send off to backend
    const result = await business.updateSpecificRecognition(
      orgId,
      memberId,
      body["membership_years"]
    );

    // check for errors that backend returned
    if (result.error && result.error !== error.noError) {
      res
        .status(404)
        .json({ error: result.error, orgId: orgId, memberId: memberId });
      return;
    }

    // return with appropriate status error and message
    res.status(200).json({ status: "success", data: result.data });
  }
);

module.exports = router;
