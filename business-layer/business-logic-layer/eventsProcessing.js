const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieve all events for a specific organization with attendance records.
 */
async function getAllEventsByOrganization(orgId) {
  // TODO: Replace with a database call to fetch events and attendance for the given organization.

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
      "event_type": "Meeting",
      "attendance": [
        {
          "attendance_id": 101,
          "member_id": 5,
          "check_in": "2024-05-10T18:05:00Z"
        },
        {
          "attendance_id": 102,
          "member_id": 7,
          "check_in": "2024-05-10T18:10:00Z"
        }
      ]
    },
    {
      "event_id": 2,
      "organization_id": 1,
      "event_name": "Volunteer Event",
      "event_start": "2024-05-15T14:00:00Z",
      "event_end": "2024-05-15T17:00:00Z",
      "event_location": "Community Center",
      "event_description": "Helping with food drive",
      "event_type": "Volunteering",
      "attendance": []
    }
  ]
  */

  return { error: error.noError, data: "data-here" };
}

/**
 * Retrieve a specific event by ID with its attendance records.
 */
async function getEventById(orgId, eventId) {
  // TODO: Replace with a database call to fetch a specific event by eventId along with attendance.

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
    "event_type": "Meeting",
    "attendance": [
      {
        "attendance_id": 101,
        "member_id": 5,
        "check_in": "2024-05-10T18:05:00Z"
      },
      {
        "attendance_id": 102,
        "member_id": 7,
        "check_in": "2024-05-10T18:10:00Z"
      }
    ]
  }
  */

  return { error: error.noError, data: "data-here" };
}

/**
 * Create a new event.
 */
async function createEvent(orgId, eventData) {
  // TODO: Replace with a database call to insert a new event record.

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
  // TODO: Replace with a database call to update an event record.

  /*
  Expected Output:

  {
    "event_id": 3,
    "organization_id": 1,
    "event_name": "Hackathon 2024",
    "event_start": "2024-06-01T09:00:00Z",
    "event_end": "2024-06-01T18:00:00Z",
    "event_location": "Tech Lab",
    "event_description": "Annual coding competition - extended hours",
    "event_type": "Competition"
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
