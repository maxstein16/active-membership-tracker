let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");

// GET /v1/organization/{orgId}/membership/{role}
router.get(
  "/:role",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let orgId = req.params.orgId;
    let role = req.params.role;

    orgId = sanitizer.sanitize(orgId);
    role = sanitizer.sanitize(role);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (isNaN(role)) {
      return res.status(400).json({ error: error.roleMustBeAnInteger });
    }

    const result = await business.getMembershipRoleInOrg(orgId, role);

    if (result.error && result.error !== error.noError) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({ status: "success", data: result.data });
  }
);

// GET /v1/organization/{orgId}/membership/
router.get(
  "/:orgId/membership/",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let orgId = req.params.orgId;

    orgId = sanitizer.sanitize(orgId);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    const result = await business.getAllMembershipsInfoInOrg(orgId);

    if (result.error && result.error !== error.noError) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({ status: "success", data: result.data });
  }
);

module.exports = router;
