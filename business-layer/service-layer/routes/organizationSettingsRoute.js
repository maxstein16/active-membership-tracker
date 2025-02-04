const express = require("express");
const router = express.Router();

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

//GET /v1/organization/:orgId/settings
router.get("/v1/organization/:orgId/settings", async function (req, res) {
  let orgId = req.params.orgId;
  
  orgId = sanitizer.sanitize(orgId);

  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }

  const response = await business.getOrganizationSettings(parseInt(orgId));

  if (response.error !== error.noError) {
    return res.status(404).json({ error: error.organizationNotFound });
  }

  return res.status(200).json({ status: "success", data: response.data });
});

//PUT /v1/organization/:orgId/membership-requirements
router.put("/v1/organization/:orgId/membership-requirements", async function (req, res) {
  let orgId = req.params.orgId;
  let { setting_id, meeting_type, frequency, amount_type, amount } = req.body;

  orgId = sanitizer.sanitize(orgId);
  setting_id = sanitizer.sanitize(setting_id);

  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }
  if (isNaN(setting_id)) {
    return res.status(400).json({ error: error.settingIdMustBeInteger });
  }
  if (!meeting_type && !frequency && !amount_type && !amount) {
    return res.status(400).json({ error: error.mustHaveAtLeastOneFieldToUpdate });
  }

  const response = await business.editOrganizationMembershipRequirements(parseInt(orgId), req.body);

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
});

//PUT /v1/organization/:orgId/email-settings
router.put("/v1/organization/:orgId/email-settings", async function (req, res) {
  let orgId = req.params.orgId;
  let { current_status, annual_report, semester_report, membership_achieved } = req.body;

  orgId = sanitizer.sanitize(orgId);

  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }
  if (!current_status && !annual_report && !semester_report && !membership_achieved) {
    return res.status(400).json({ error: error.mustIncludeAtLeastOneValidFieldToEdit });
  }

  const response = await business.editOrganizationEmailSettings(parseInt(orgId), req.body);

  if (response.error !== error.noError) {
    return res.status(404).json({ error: error.organizationNotFound });
  }

  return res.status(200).json({ status: "success", data: response.data });
});

//DELETE /v1/organization/:orgId/membership-requirements
router.delete("/v1/organization/:orgId/membership-requirements", async function (req, res) {
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

  const response = await business.deleteOrganizationMembershipRequirement(parseInt(orgId), parseInt(id));

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
});

module.exports = router;
