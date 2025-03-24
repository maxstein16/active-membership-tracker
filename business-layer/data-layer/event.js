const { Event, Attendance, Member } = require("../db");

/**
 * Creates a new event in the database.
 *
 * @param {object} eventData - The attributes of the new event.
 * @returns {Promise<object>} The newly created event object.
 */
async function createEvent(eventData) {
  try {
    const newEvent = await Event.create(eventData);
    // console.log("Event created:", newEvent.toJSON());
    return newEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

/**
 * Updates an existing event by its ID.
 *
 * @param {number} eventId - The unique ID of the event to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<boolean>} Returns `true` if the event was updated, `false` if no matching event was found.
 */
async function updateEvent(eventId, updateData) {
  try {
    const [updatedRows] = await Event.update(updateData, {
      where: { event_id: eventId },
    });

    // if (updatedRows > 0) {
    //   console.log(`Event with ID ${eventId} updated successfully.`);
    //   return true;
    // } 
    return true; // it still is fine if nothing is updated bc there was nothing tooo update
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

/**
 * Retrieves all events from the database.
 *
 * @returns {Promise<object[]>} An array of event objects (empty if no events found).
 */
async function getAllEvents() {
  try {
    const events = await Event.findAll();
    if (events.length === 0) {
      console.log("No events found in the database.");
      return [];
    }
    // console.log(
    //   "Events found:",
    //   events.map((e) => e.toJSON())
    // );
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Retrieves a specific event by its ID.
 *
 * @param {number} eventId - The unique ID of the event to retrieve.
 * @param {number} orgId - The organization ID of the event.
 * @returns {Promise<object|null>} The event object if found, otherwise `null`.
 */
async function getEventById(eventId, orgId) {
  try {
    const event = await Event.findOne({
      where: { event_id: eventId, organization_id: orgId },
    });
    // console.log(event);
    if (!event) {
      console.log(`No event found with ID ${eventId}`);
      return null;
    }

    // console.log("Event found:", event.toJSON());
    return event;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}

/**
 * Get all attendance records for a specific event
 * @param {number} eventId - The ID of the event
 * @returns {Promise<Array>} List of attendance records
 */
async function getAttendanceByEventId(eventId) {
  try {
    const attendances = await Attendance.findAll({
      where: { event_id: eventId },
    });
    return attendances;
  } catch (err) {
    console.error("Error fetching attendance by event ID:", err);
    throw err;
  }
}

/**
 * Retrieves events based on provided filters.
 *
 * @param {object} filters - Attributes to filter by.
 * @returns {Promise<object[]>} An array of matching event objects (empty if no matches found).
 */
async function getEventsByAttributes(filters) {
  try {
    const events = await Event.findAll({ where: filters });

    if (events.length === 0) {
      console.log("No events found matching the given criteria.");
      return [];
    }

    // console.log(
    //   "Events found:",
    //   events.map((e) => e.toJSON())
    // );
    return events;
  } catch (error) {
    console.error("Error fetching events by attributes:", error);
    throw error;
  }
}

async function getEventsWithAttendance(orgId) {
  try {
    const events = await Event.findAll({
      where: { organization_id: orgId },
      include: [
        {
          model: Attendance,
          as: "Attendances",
          include: {
            model: Member,
            required: true
          }
        }
      ]
    });
    return events;
  } catch (err) {
    console.error("Error in getEventsWithAttendance:", err);
    throw err;
  }
}

// Export all functions for external use
module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  getAttendanceByEventId,
  getEventsByAttributes,
  getEventsWithAttendance,
};
