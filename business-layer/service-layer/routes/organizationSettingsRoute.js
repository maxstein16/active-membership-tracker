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

//GET /v1/organization/:orgId/settings
router.get("/", isAdminOrEboardForOrg, async function (req, res) {
  console.log('here 2')
  let orgId = req.params.orgId;

  orgId = sanitizer.sanitize(orgId);

  console.log('here 3')
  if (isNaN(orgId)) {
    console.log('here 4')
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }

  console.log('here 5')
  const response = await business.getOrganizationSettings(parseInt(orgId));

  console.log('here 6')
  if (response.error !== error.noError) {
    console.log('here 7')
    return res.status(404).json({ error: response.error });
  }

  console.log('here 8')
  return res.status(200).json({ status: "success", data: response.data });
});

//PUT /v1/organization/:orgId/settings/membership-requirements
router.put(
  "/membership-requirements",
  isAdminOrEboardForOrg,
  async function (req, res) {
    let orgId = req.params.orgId;
    let reqId = req.body.requirement_id;

    orgId = sanitizer.sanitize(orgId);
    reqId = sanitizer.sanitize(reqId);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (!reqId || isNaN(reqId)) {
      return res.status(400).json({ error: error.settingIdMustBeInteger });
    }
    if (
      !req.body.hasOwnProperty("event_type") &&
      !req.body.hasOwnProperty("requirement_type") &&
      !req.body.hasOwnProperty("requirement_value")
    ) {
      return res
        .status(400)
        .json({ error: error.mustHaveAtLeastOneFieldToUpdate });
    }

    const response = await business.editOrganizationMembershipRequirement(
      parseInt(orgId),
      req.body
    );

    if (response.error !== error.noError) {
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json({ status: "success", data: response.data });
  }
);
//POST /v1/organization/:orgId/settings/membership-requirements
router.post(
  "/membership-requirements",
  isAdminOrEboardForOrg,
  async function (req, res) {
    let orgId = req.params.orgId;

    orgId = sanitizer.sanitize(orgId);
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (
      !req.body.hasOwnProperty("event_type") ||
      !req.body.hasOwnProperty("requirement_type") ||
      !req.body.hasOwnProperty("requirement_value")
    ) {
      return res.status(400).json({ error: error.newReqMustHaveAllParams });
    }

    const response = await business.createOrganizationMembershipRequirements(
      parseInt(orgId),
      req.body
    );

    if (response.error !== error.noError) {
      return res.status(400).json({ error: response.error });
    }
    return res.status(200).json({ status: "success", data: response.data });
  }
);

//PUT /v1/organization/:orgId/settings/email-settings
router.put("/email-settings", isAdminOrEboardForOrg, async function (req, res) {
  let orgId = req.params.orgId;
  // let {
  //   current_status,
  //   annual_report,
  //   semester_report,
  //   membership_achieved,
  // } = req.body;

  // console.log(current_status)
  // console.log(annual_report)
  // console.log(semester_report)
  // console.log(membership_achieved)

  orgId = sanitizer.sanitize(orgId);

  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }
  if (
    !req.body.hasOwnProperty("current_status") &&
    !req.body.hasOwnProperty("annual_report") &&
    !req.body.hasOwnProperty("semester_report") &&
    !req.body.hasOwnProperty("membership_achieved")
  ) {
    return res
      .status(400)
      .json({ error: error.mustIncludeAtLeastOneValidFieldToEdit });
  }
  
  const response = await business.editOrganizationEmailSettings(
    parseInt(orgId),
    req.body
  );

  if (response.error !== error.noError) {
    return res.status(404).json({ error: error.organizationNotFound });
  }

  return res.status(200).json({ status: "success", data: response.data });
});

//DELETE /v1/organization/:orgId/settings/membership-requirements/:id
router.delete(
  "/membership-requirements",
  isAdminOrEboardForOrg,
  async function (req, res) {
    let orgId = req.params.orgId;
    let id = req.query.id;

    orgId = sanitizer.sanitize(orgId);
    id = sanitizer.sanitize(id);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: error.mustIncludeIdQueryParam });
    }

    // does the user have privileges?
    // const hasPrivileges = hasCredentials.isAdmin(req.session.user.username, orgId)
    // if (!hasPrivileges) {
    //   res.status(401).json({ error: error.youDoNotHavePermission });
    // }

    const response = await business.deleteOrganizationMembershipRequirement(
      parseInt(orgId),
      parseInt(id)
    );

    if (response.error !== error.noError) {
      if (response.error === error.organizationNotFound) {
        return res.status(404).json({ error: error.organizationNotFound });
      }
      if (response.error === error.settingNotFound) {
        return res.status(404).json({ error: error.settingNotFound });
      }
      return res.status(400).json({ error: error.somethingWentWrong });
    }

    return res.status(200).json({ status: "success", data: response.data });
  }
);

//POST /v1/organization/:orgId/settings/membership-requirements/bonuses
router.post(
  "/membership-requirements/bonuses",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let orgId = req.params.orgId;
    let { requirement_id, threshold_percentage, bonus_points } = req.body;

    orgId = sanitizer.sanitize(orgId);
    requirement_id = sanitizer.sanitize(requirement_id);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (isNaN(requirement_id)) {
      return res.status(400).json({ error: error.settingNotFound });
    }
    if (!threshold_percentage || isNaN(threshold_percentage)) {
      return res.status(400).json({ error: error.somethingWentWrong });
    }
    if (!bonus_points || isNaN(bonus_points)) {
      return res.status(400).json({ error: error.somethingWentWrong });
    }

    const response = await business.createBonusRequirement(requirement_id, {
      threshold_percentage,
      bonus_points,
    });

    if (response.error !== error.noError) {
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json({ status: "success", data: response.data });
  }
);

//PUT /v1/organization/:orgId/settings/membership-requirements/bonuses
router.put(
  "/membership-requirements/bonuses",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let orgId = req.params.orgId;
    let { bonus_id, threshold_percentage, bonus_points } = req.body;

    orgId = sanitizer.sanitize(orgId);
    bonus_id = sanitizer.sanitize(bonus_id);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (isNaN(bonus_id)) {
      return res.status(400).json({ error: error.settingNotFound });
    }
    if (!threshold_percentage && !bonus_points) {
      return res
        .status(400)
        .json({ error: error.mustHaveAtLeastOneFieldToUpdate });
    }

    const response = await business.editBonusRequirement(bonus_id, {
      threshold_percentage,
      bonus_points,
    });

    if (response.error !== error.noError) {
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json({ status: "success", data: response.data });
  }
);

//DELETE /v1/organization/:orgId/settings/membership-requirements/bonuses
router.delete(
  "/membership-requirements/bonuses",
  isAuthorizedHasSessionForAPI,
  async function (req, res) {
    let orgId = req.params.orgId;
    let bonusId = req.query.bonus_id;

    orgId = sanitizer.sanitize(orgId);
    bonusId = sanitizer.sanitize(bonusId);

    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (!bonusId || isNaN(bonusId)) {
      return res.status(400).json({ error: error.settingNotFound });
    }

    const response = await business.deleteBonusRequirement(parseInt(bonusId));

    if (response.error !== error.noError) {
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json({ status: "success", data: { deleted: true } });
  }
);

module.exports = router;
