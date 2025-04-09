const Error = require("./public/errors.js");
const error = new Error();
const {
  getEventsByAttributes,
  createEvent,
  getEventById,
  updateEvent,
  getAttendanceByEventId,
} = require("../data-layer/event.js");
const { getSemesterByDate } = require("../data-layer/semester.js");

/**
 * Retrieve all events for a specific organization with attendance records.
 */
async function getAllEventsByOrganizationInDB(orgId) {
  try {
    // Validate input
    if (!orgId || isNaN(orgId) || orgId <= 0) {
      return { error: error.invalidInput, data: null };
    }

    // Get all events for the organization
    const events = await getEventsByAttributes({ organization_id: orgId });

    if (!events || !events.length) {
      return { error: error.noError, data: [] };
    }

    // Fetch attendance records for each event
    const eventsWithAttendance = await Promise.all(
      events.map(async (event) => {
        const attendanceResult = await getAttendanceByEventId(event.event_id);
        const eventJson = event.toJSON();
        return {
          ...eventJson,
          attendances: attendanceResult || [],
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
async function getEventByIDInDB(eventId, orgId) {
  try {
    const event = await getEventById(eventId, orgId);

    if (!event) {
      return { error: error.eventNotFound, data: null };
    }

    const attendanceResult = await getAttendanceByEventId(eventId);

    const eventWithAttendance = {
      ...event.toJSON(),
      attendances:
        attendanceResult.error === error.noError ? attendanceResult.data : [],
    };

    return { error: error.noError, data: eventWithAttendance };
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Create a new event and ensure it belongs to the correct semester.
 *
 * @param {number} orgId - The ID of the organization.
 * @param {Object} eventData - Event details (name, start/end date, location, etc.).
 * @returns {Promise<Object>} The created event with error handling.
 */
async function createEventInDB(orgId, eventData) {
  try {
    // Ensure the event date is associated with an existing semester (or create one if needed)
    const semester = await ensureSemesterExistsForEvent(new Date(eventData.event_start));

    if (!semester) {
      return { error: error.semesterCreationFailed, data: null };
    }

    // Create the event with the found/created semester
    // console.log(eventData)
    const newEvent = await createEvent({
      organization_id: orgId,
      semester_id: semester.semester_id,  // Assign the semester
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
 * Ensures that a semester exists for a given event date.
 * If a semester doesn't exist, a new one is created.
 *
 * @param {Date} eventDate - The date of the event.
 * @returns {Promise<Semester>} The existing or newly created semester.
 */
async function ensureSemesterExistsForEvent(eventDate) {
  try {
    const semester = await getSemesterByDate(eventDate);
    if (semester) {
      return semester;
    }

    // If no semester found, determine academic year and semester type
    const year = eventDate.getFullYear();
    let semesterName, startDate, endDate, academicYear;

    if (eventDate.getMonth() >= 0 && eventDate.getMonth() <= 4) {
      // January - May → Spring Semester
      semesterName = `Spring ${year}`;
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 4, 31);
      academicYear = `${year - 1}-${year}`;
    } else {
      // August - December → Fall Semester
      semesterName = `Fall ${year}`;
      startDate = new Date(year, 7, 1);
      endDate = new Date(year, 11, 31);
      academicYear = `${year}-${year + 1}`;
    }

    return await createSemester(semesterName, academicYear, startDate, endDate);
  } catch (error) {
    console.error("Error ensuring semester exists:", error);
    throw error;
  }
}

/**
 * Update an existing event.
 */
async function updateEventInDB(orgId, eventId, updateData) {
  try {
    // First verify the event belongs to the organization
    const existingEvent = await getEventById(eventId, orgId);
    if (!existingEvent) {
      return { error: error.eventNotFound, data: null };
    }
   
    const updated = await updateEvent(eventId, updateData);
    if (!updated) {
      return { error: error.eventNotFound, data: null };
    }

    // Get the updated event with attendance
    return await getEventById(eventId, orgId);
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

/**
 * Retrieve all events for a specific organization filtered by semester IDs with attendance records.
 * @param {number} orgId - The organization ID
 * @param {number[]} semesterIds - Array of semester IDs to filter by
 * @returns {Promise<Object>} Object containing error and data properties
 */
async function getAllEventsByOrgAndSemesterDB(orgId, semesterIds) {
  try {
    if (!Array.isArray(semesterIds)) {
      return { error: error.invalidInput, data: null };
    }

    // Get all events for the organization and specified semesters
    const events = await getEventsByAttributes({
      organization_id: orgId,
      semester_id: semesterIds,
    });

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
          attendances:
            attendanceResult.error === error.noError
              ? attendanceResult.data
              : [],
        };
      })
    );

    return { error: error.noError, data: eventsWithAttendance };
  } catch (err) {
    console.error("Error fetching events by organization and semesters:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

module.exports = {
  getAllEventsByOrganizationInDB,
  getEventByIDInDB,
  getAttendanceByEventIdDB,
  createEventInDB,
  updateEventInDB,
  getAllEventsByOrgAndSemesterDB,
};
