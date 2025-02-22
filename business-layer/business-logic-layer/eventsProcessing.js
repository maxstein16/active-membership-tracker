const Error = require("./public/errors.js");
const error = new Error();
const { getEventsByAttributes, createEvent, getEventById, updateEvent, getAttendanceByEventId } = require("../data-layer/event.js");

/**
 * Retrieve all events for a specific organization with attendance records.
 */
async function getAllEventsByOrganizationInDB(orgId) {
  try {
    // Get all events for the organization
    const events = await getEventsByAttributes({ organization_id: orgId });
    
    if (!events.length) {
      return { error: error.noError, data: [] };
    }

    // Fetch attendance records for each event
    const eventsWithAttendance = await Promise.all(
      events.map(async (event) => {
        const attendanceResult = await getAttendanceByEventId(event.event_id);
        const eventJson = event.toJSON();
        return {
          ...eventJson,
          attendances: attendanceResult.error === error.noError ? attendanceResult.data : []
        };
      })
    );

    return { error: error.noError, data: eventsWithAttendance };
  } catch (err) {
    console.error("Error fetching events by organization:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Retrieve a specific event by ID with its attendance records.
 */
async function getEventByIDInDB(orgId, eventId) {
  try {
    // Get the event
    const event = await getEventById(eventId);
    
    if (!event || event.organization_id !== orgId) {
      return { error: error.eventNotFound, data: null };
    }

    // Get attendance records for the event
    const attendanceResult = await getAttendanceByEventId(eventId);
    
    const eventWithAttendance = {
      ...event.toJSON(),
      attendances: attendanceResult.error === error.noError ? attendanceResult.data : []
    };

    return { error: error.noError, data: eventWithAttendance };
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Create a new event.
 */
async function createEventInDB(orgId, eventData) {
  try {
    const newEvent = await createEvent({
      organization_id: orgId,
      event_name: eventData.event_name,
      event_start: eventData.event_start,
      event_end: eventData.event_end,
      event_location: eventData.event_location,
      event_description: eventData.event_description,
      event_type: eventData.event_type,
    });

    return { error: error.noError, data: newEvent };
  } catch (err) {
    console.error("Error creating event:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Update an existing event.
 */
async function updateEventInDB(orgId, eventId, updateData) {
  try {
    // First verify the event belongs to the organization
    const existingEvent = await getEventById(eventId);
    if (!existingEvent || existingEvent.organization_id !== orgId) {
      return { error: error.eventNotFound, data: null };
    }

    const updated = await updateEvent(eventId, updateData);
    if (!updated) {
      return { error: error.eventNotFound, data: null };
    }

    // Get the updated event with attendance
    return await getEventById(orgId, eventId);
  } catch (err) {
    console.error("Error updating event:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Retrieves attendance records for a specific event.
 * @param {number} eventId - The ID of the event
 * @returns {Promise<Object>} Object containing error and data properties
 */
const getAttendanceByEventIdDB = async (eventId) => {
  try {
      const attendance = await getAttendanceByEventId(eventId);
      if (!attendance || attendance.length === 0) {
          return { error: error.eventNotFound, data: null };
      }

      return { error: error.noError, data: attendance };
  } catch (err) {
      console.error("Error fetching attendance by Event ID:", err);
      return { error: error.somethingWentWrong, data: null };
  }
}; // getAttendanceByEventId

module.exports = {
  getAllEventsByOrganizationInDB,
  getEventByIDInDB,
  getAttendanceByEventIdDB,
  createEventInDB,
  updateEventInDB,
};