const { Event, Attendance } = require("../db"); // Import models
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieve all events for a specific organization with attendance records.
 */
async function getAllEventsByOrganization(orgId) {
  try {
    const events = await Event.findAll({
      where: { organization_id: orgId },
      include: [
        {
          model: Attendance,
          as: "attendances",
          attributes: ["attendance_id", "member_id", "check_in"],
        },
      ],
    });

    if (!events.length) {
      return { error: error.noError, data: [] };
    }

    return { error: error.noError, data: events };
  } catch (err) {
    console.error("Error fetching events by organization:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Retrieve a specific event by ID with its attendance records.
 */
async function getEventById(orgId, eventId) {
  try {
    const event = await Event.findOne({
      where: { event_id: eventId, organization_id: orgId },
      include: [
        {
          model: Attendance,
          as: "attendances",
          attributes: ["attendance_id", "member_id", "check_in"],
        },
      ],
    });

    if (!event) {
      return { error: error.eventNotFound, data: null };
    }

    return { error: error.noError, data: event };
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Create a new event.
 */
async function createEvent(orgId, eventData) {
  try {
    const newEvent = await Event.create({
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
async function updateEvent(orgId, eventId, updateData) {
  try {
    const [updatedRows] = await Event.update(updateData, {
      where: { event_id: eventId, organization_id: orgId },
    });

    if (updatedRows === 0) {
      return { error: error.eventNotFound, data: null };
    }

    const updatedEvent = await Event.findOne({
      where: { event_id: eventId, organization_id: orgId },
    });

    return { error: error.noError, data: updatedEvent };
  } catch (err) {
    console.error("Error updating event:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

module.exports = {
  getAllEventsByOrganization,
  getEventById,
  createEvent,
  updateEvent,
};
