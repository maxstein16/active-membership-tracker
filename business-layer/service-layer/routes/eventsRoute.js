let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const {
  isAuthorizedHasSessionForAPI,
  isAdminOrEboardForOrg,
} = require("../sessionMiddleware.js");
const sanitizer = new Sanitizer();

const hasCredentials = require("../../business-logic-layer/public/hasCredentials.js");

/**
 * GET v1/organization/{orgId}/events
 * Get all events for an organization.
 */
router.get("/", isAuthorizedHasSessionForAPI, async (req, res) => {
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
});

/**
 * GET /organization/{orgId}/events/{eventId}
 * Get a specific event's details.
 */
router.get("/:eventId", isAuthorizedHasSessionForAPI, async (req, res) => {
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
  const event = await business.getEventById(eventId, orgId);

  // Handle errors
  if (event.error && event.error !== error.noError) {
    return res.status(404).json({ error: event.error, orgId, eventId });
  }

  return res.status(200).json({ status: "success", data: event.data });
});

/**
 * POST v1/organization/{orgId}/events
 * Create a new event for an organization.
 */
router.post("/", isAuthorizedHasSessionForAPI, async (req, res) => {
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
    !req.body.hasOwnProperty("event_name") ||
    !req.body.hasOwnProperty("event_start") ||
    !req.body.hasOwnProperty("event_end") ||
    !req.body.hasOwnProperty("event_location") ||
    !req.body.hasOwnProperty("event_description") ||
    !req.body.hasOwnProperty("event_type")
  ) {
    return res.status(400).json({ error: error.mustHaveAllFieldsCreateEvent });
  }

  // Send to business layer
  const result = await business.createEvent(orgId, req.body);

  // Handle errors
  if (result.error && result.error !== error.noError) {
    return res.status(500).json({ error: result.error, orgId });
  }

  return res.status(201).json({ status: "success", data: result.data });
});

/**
 * PUT /organization/{orgId}/events/{eventId}
 * Update a specific event's details.
 */
router.put("/:eventId", isAdminOrEboardForOrg, async (req, res) => {
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
    !req.body.hasOwnProperty("event_name") &&
    !req.body.hasOwnProperty("event_start") &&
    !req.body.hasOwnProperty("event_end") &&
    !req.body.hasOwnProperty("event_location") &&
    !req.body.hasOwnProperty("event_description") &&
    !req.body.hasOwnProperty("event_type")
  ) {
    return res
      .status(400)
      .json({ error: error.mustHaveAtLeastOneFieldToUpdateEvent });
  }

  // Send to business layer
  const result = await business.updateEvent(orgId, eventId, req.body);

  // Handle errors
  if (result.error && result.error !== error.noError) {
    return res.status(500).json({ error: result.error, orgId, eventId });
  }

  return res
    .status(200)
    .json({ status: "success", message: "Event updated successfully." });
});

module.exports = router;
