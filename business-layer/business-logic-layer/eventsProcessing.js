const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieve all events for a specific organization.
 */
async function getAllEventsByOrganization(orgId) {
  // TODO: Replace with database call to fetch events for the given organization.

  /*
  Expected Output:

  [
    {
      "event_id": 1,
      "organization_id": 1,
      "event_name": "General Meeting",
      "event_start": "2024-05-10T18:00:00Z",
      "event_end": "2024-05-10T20:00:00Z",
      "event_location": "Main Hall",
      "event_description": "Monthly general meeting",
      "event_type": "Meeting"
    },
    {
      "event_id": 2,
      "organization_id": 1,
      "event_name": "Volunteer Event",
      "event_start": "2024-05-15T14:00:00Z",
      "event_end": "2024-05-15T17:00:00Z",
      "event_location": "Community Center",
      "event_description": "Helping with food drive",
      "event_type": "Volunteering"
    }
  ]
  */

  return { error: error.noError, data: "data-here" };
}

/**
 * Retrieve a specific event by ID.
 */
async function getEventById(orgId, eventId) {
  // TODO: Replace with database call to fetch a specific event by eventId.

  /*
  Expected Output:

  {
    "event_id": 1,
    "organization_id": 1,
    "event_name": "General Meeting",
    "event_start": "2024-05-10T18:00:00Z",
    "event_end": "2024-05-10T20:00:00Z",
    "event_location": "Main Hall",
    "event_description": "Monthly general meeting",
    "event_type": "Meeting"
  }
  */

  return { error: error.noError, data: "data-here" };
}

/**
 * Create a new event.
 */
async function createEvent(orgId, eventData) {
  // TODO: Replace with database call to insert a new event record.

  /*
  Expected Output:

  {
    "event_id": 3,
    "organization_id": 1,
    "event_name": "Hackathon",
    "event_start": "2024-06-01T09:00:00Z",
    "event_end": "2024-06-01T17:00:00Z",
    "event_location": "Tech Lab",
    "event_description": "Annual coding competition",
    "event_type": "Competition"
  }
  */

  return { error: error.noError, data: "data-here" };
}

/**
 * Update an existing event.
 */
async function updateEvent(orgId, eventId, updateData) {
  // TODO: Replace with database call to update an existing event by eventId.

  /*
  Expected Output:

  {
    "event_id": 1,
    "organization_id": 1,
    "event_name": "Updated General Meeting",
    "event_start": "2024-05-10T18:30:00Z",
    "event_end": "2024-05-10T20:30:00Z",
    "event_location": "Main Hall",
    "event_description": "Updated monthly general meeting",
    "event_type": "Meeting"
  }
  */

  return { error: error.noError, data: "data-here" };
}

module.exports = {
  getAllEventsByOrganization,
  getEventById,
  createEvent,
  updateEvent,
};
