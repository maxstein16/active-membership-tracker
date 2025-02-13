let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware.js");
const sanitizer = new Sanitizer();

const hasCredentials = require("../../business-logic-layer/public/hasCredentials.js");

/**
 * GET v1/organizations/{orgId}/events
 * Get all events for an organization.
 */
router.get(
  "/",
  isAuthorizedHasSessionForAPI,
  async (req, res) => {
    let orgId = req.params.orgId;

    // Sanitize input
    orgId = sanitizer.sanitize(orgId);

    // Validate organization ID
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    // Fetch data from business layer
    const events = await business.getAllEventsByOrganization(orgId);

    // Handle errors
    if (events.error && events.error !== error.noError) {
      return res.status(404).json({ error: events.error, orgId });
    }

    return res.status(200).json({ status: "success", data: events.data });
  }
);

/**
 * GET /organizations/{orgId}/events/{eventId}
 * Get a specific event's details.
 */
router.get(
  "/:eventId",
  isAuthorizedHasSessionForAPI,
  async (req, res) => {
    let { orgId, eventId } = req.params;

    // Sanitize input
    orgId = sanitizer.sanitize(orgId);
    eventId = sanitizer.sanitize(eventId);

    // Validate IDs
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (isNaN(eventId)) {
      return res.status(400).json({ error: error.eventIdMustBeInteger });
    }

    // Fetch data from business layer
    const event = await business.getEventById(orgId, eventId);

    // Handle errors
    if (event.error && event.error !== error.noError) {
      return res.status(404).json({ error: event.error, orgId, eventId });
    }

    return res.status(200).json({ status: "success", data: event.data });
  }
);

/**
 * POST v1/organizations/{orgId}/events
 * Create a new event for an organization.
 */
router.post(
  "/",
  isAuthorizedHasSessionForAPI,
  async (req, res) => {
    let orgId = req.params.orgId;
    let body = req.body;

    // Sanitize input
    orgId = sanitizer.sanitize(orgId);

    // Validate organization ID
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    
    // Validate required fields
    if (
      !body.event_name ||
      !body.event_start ||
      !body.event_end ||
      !body.event_location ||
      !body.event_description ||
      !body.event_type
    ) {
      return res
        .status(400)
        .json({ error: error.mustHaveAllFieldsCreateEvent });
    }

    // does the user have privileges?
    // const hasPrivileges = hasCredentials.isEboardOrAdmin(req.session.user.username, orgId)
    // if (!hasPrivileges) {
    //   res.status(401).json({ error: error.youDoNotHavePermission });
    // }

    // Send to business layer
    const result = await business.createEvent(orgId, body);

    // Handle errors
    if (result.error && result.error !== error.noError) {
      return res.status(500).json({ error: result.error, orgId });
    }

    return res.status(201).json({ status: "success", data: result.data });
  }
);

/**
 * POST /organizations/{orgId}/events/{eventId}
 * Update a specific event's details.
 */
router.put(
  "/:eventId",
  isAuthorizedHasSessionForAPI,
  async (req, res) => {
    let { orgId, eventId } = req.params;

    // Sanitize input
    orgId = sanitizer.sanitize(orgId);
    eventId = sanitizer.sanitize(eventId);

    // Validate IDs
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }
    if (isNaN(eventId)) {
      return res.status(400).json({ error: error.eventIdMustBeInteger });
    }

    // Validate required fields
    if (
      !body.event_name &&
      !body.event_start &&
      !body.event_end &&
      !body.event_location &&
      !body.event_description &&
      !body.event_type
    ) {
      return res
        .status(400)
        .json({ error: error.mustHaveAtLeastOneFieldToUpdateEvent });
    }

    // does the user have privileges?
    // const hasPrivileges = hasCredentials.isEboardOrAdmin(req.session.user.username, orgId)
    // if (!hasPrivileges) {
    //   res.status(401).json({ error: error.youDoNotHavePermission });
    // }

    // Send to business layer
    const result = await business.updateEvent(orgId, eventId, body);

    // Handle errors
    if (result.error && result.error !== error.noError) {
      return res.status(500).json({ error: result.error, orgId, eventId });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Event updated successfully." });
  }
);

module.exports = router;
