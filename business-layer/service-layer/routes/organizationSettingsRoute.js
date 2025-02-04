let express = require("express");
const router = express.Router();

/*

https://api.rit.edu/v1/organization/{orgId}/settings

*/

// GET /v1/organization/{orgId}/settings
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization Settings Route", org: req.params.orgId });
});

// GET /v1/organization/:orgId/settings
router.get("/v1/organization/:orgId/settings", async function (req, res) {
  let orgId = req.params.orgId;

  // Sanitize params
  orgId = sanitizer.sanitize(orgId);

  // Check if params are valid!
  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }

  const organization = organizations.find(org => org.organization_id === parseInt(orgId));

  if (organization) {
    res.status(200).json({
      status: "success",
      data: organization
    });
  } else {
    res.status(404).json({
      error: error.organizationNotFound
    });
  }
});

/*
  https://api.rit.edu/v1/organization/{orgId}/membership-requirements
*/

// PUT /v1/organization/:orgId/membership-requirements
router.put("/v1/organization/:orgId/membership-requirements", async function (req, res) {
  let orgId = req.params.orgId;
  let { setting_id, meeting_type, frequency, amount_type, amount } = req.body;

  // Sanitize params
  orgId = sanitizer.sanitize(orgId);
  setting_id = sanitizer.sanitize(setting_id);

  // Check if params are valid!
  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }
  if (isNaN(setting_id)) {
    return res.status(400).json({ error: error.settingIdMustBeInteger });
  }

  const organization = organizations.find(org => org.organization_id === parseInt(orgId));

  if (!organization) {
    return res.status(404).json({
      error: error.organizationNotFound
    });
  }

  const setting = organization.active_membership_requirements.find(req => req.settingId === parseInt(setting_id));

  if (!setting) {
    return res.status(404).json({
      error: error.settingNotFound
    });
  }

  if (!meeting_type && !frequency && !amount_type && !amount) {
    return res.status(400).json({
      error: error.mustHaveAtLeastOneFieldToUpdate
    });
  }

  if (meeting_type) setting.meeting_type = meeting_type;
  if (frequency) setting.frequency = frequency;
  if (amount_type) setting.amount_type = amount_type;
  if (amount) setting.amount = amount;

  res.status(200).json({
    status: "success",
    data: organization
  });
});

/*
  https://api.rit.edu/v1/organization/{orgId}/email-settings
*/

// PUT /v1/organization/:orgId/email-settings
router.put("/v1/organization/:orgId/email-settings", async function (req, res) {
  let orgId = req.params.orgId;
  let { current_status, annual_report, semester_report, membership_achieved } = req.body;

  // Sanitize params
  orgId = sanitizer.sanitize(orgId);

  // Check if params are valid!
  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }

  const organization = organizations.find(org => org.organization_id === parseInt(orgId));

  if (!organization) {
    return res.status(404).json({
      error: error.organizationNotFound
    });
  }

  if (!current_status && !annual_report && !semester_report && !membership_achieved) {
    return res.status(400).json({
      error: error.mustIncludeAtLeastOneValidFieldToEdit
    });
  }

  if (current_status) organization.email_settings.current_status = current_status;
  if (annual_report) organization.email_settings.annual_report = annual_report;
  if (semester_report) organization.email_settings.semester_report = semester_report;
  if (membership_achieved) organization.email_settings.membership_achieved = membership_achieved;

  res.status(200).json({
    status: "success",
    data: organization
  });
});

/*
  https://api.rit.edu/v1/organization/{orgId}/membership-requirements
*/

// DELETE /v1/organization/:orgId/membership-requirements
router.delete("/v1/organization/:orgId/membership-requirements", async function (req, res) {
  let orgId = req.params.orgId;
  let id = req.query.id;

  // Sanitize params
  orgId = sanitizer.sanitize(orgId);
  id = sanitizer.sanitize(id);

  // Check if params are valid!
  if (isNaN(orgId)) {
    return res.status(400).json({ error: error.organizationIdMustBeInteger });
  }
  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: error.mustIncludeIdQueryParam
    });
  }

  const organization = organizations.find(org => org.organization_id === parseInt(orgId));

  if (!organization) {
    return res.status(404).json({
      error: error.organizationNotFound
    });
  }

  const settingIndex = organization.active_membership_requirements.findIndex(req => req.settingId === parseInt(id));

  if (settingIndex === -1) {
    return res.status(404).json({
      error: error.settingNotFound
    });
  }

  organization.active_membership_requirements.splice(settingIndex, 1);

  res.status(200).json({
    status: "success",
    data: organization
  });
});
module.exports = router;
