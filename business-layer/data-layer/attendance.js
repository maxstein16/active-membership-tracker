const { Attendance, Event, Member } = require("../db")

/**
 * Create an attendance record
 * @param {Object} attendanceData - The data to create the attendance record
 * @returns {Promise<Object>} The created attendance record
 */
async function createAttendance(attendanceData) {
  try {
    const attendance = await Attendance.create(attendanceData);
    console.log("Attendance created successfully")
    return attendance;
  } catch (err) {
    console.error("Error creating attendance:", err);
    throw err;
  }
};

/**
 * Get an attendance record by its ID
 * @param {number} attendanceId - The ID of the attendance record
 * @returns {Promise<Object|null>} The attendance record, or null if not found
 */
async function getAttendanceById(attendanceId) {
  try {
    const attendance = await Attendance.findByPk(attendanceId);
    return attendance;
  } catch (err) {
    console.error("Error fetching attendance by ID:", err);
    throw err;
  }
};

/**
 * Get all attendance records for a specific member
 * @param {number} memberId - The ID of the member
 * @returns {Promise<Array>} List of attendance records
 */
async function getAttendanceByMemberId(memberId) {
  try {
    const attendances = await Attendance.findAll({
      where: { member_id: memberId },
    });
    return attendances;
  } catch (err) {
    console.error("Error fetching attendance by member ID:", err);
    throw err;
  }
};

/**
 * Get an attendance record by member ID and event ID
 * @param {number} memberId - The ID of the member
 * @param {number} eventId - The ID of the event
 * @returns {Promise<Object|null>} The attendance record, or null if not found
 */
async function getAttendanceByMemberAndEvent(memberId, eventId) {
  try {
    const attendance = await Attendance.findOne({
      where: {
        member_id: memberId,
        event_id: eventId,
      },
    });

    if (!attendance) {
      console.log("No attendance record found for the given member and event.");
      return null;
    }

    return attendance;
  } catch (err) {
    console.error("Error fetching attendance by member and event IDs:", err);
    throw err;
  }
};


async function getMemberAttendanceWithEvents(orgId, memberId) {
  try {
    const attendances = await Attendance.findAll({
      where: { member_id: memberId },
      include: {
        model: Event,
        where: { organization_id: orgId },
        required: true
      }
    });
    return attendances;
  } catch (err) {
    console.error("Error in getMemberAttendanceWithEvents:", err);
    throw err;
  }
}

async function getEventAttendanceWithMembers(eventId) {
  try {
    const attendances = await Attendance.findAll({
      where: { event_id: eventId },
      include: {
        model: Member,
        required: true
      }
    });
    return attendances;
  } catch (err) {
    console.error("Error in getMeetingAttendanceWithMembers:", err);
    throw err;
  }
}

/**
 * Retrieves a member's attendance records for a specific event type within an organization.
 *
 * @param {number} memberId - The ID of the member.
 * @param {number} orgId - The ID of the organization.
 * @param {string} eventType - The type of event to filter by (e.g., "General Meeting").
 * @returns {Promise<object[]>} - A list of attendance records for the specified event type.
 */
async function getMemberAttendanceForEventType(memberId, orgId, eventType) {
  try {
    const attendanceRecords = await Attendance.findAll({
      include: [
        {
          model: Event,
          where: {
            organization_id: orgId,
            event_type: eventType,
          },
          required: true,
        },
      ],
      where: { member_id: memberId },
    });

    return attendanceRecords;
  } catch (error) {
    console.error("Error fetching attendance records for event type:", error);
    throw error;
  }
}

module.exports = {
  createAttendance,
  getAttendanceById,
  getAttendanceByMemberId,
  getAttendanceByMemberAndEvent,
  getMemberAttendanceWithEvents,
  getEventAttendanceWithMembers,
  getMemberAttendanceForEventType,
};
