const { Attendance, Member } = require("../db")

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

async function getMeetingAttendanceWithMembers(meetingId) {
  try {
    const attendances = await Attendance.findAll({
      where: { event_id: meetingId },
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

module.exports = {
  createAttendance,
  getAttendanceById,
  getAttendanceByMemberId,
  getAttendanceByMemberAndEvent,
  getMemberAttendanceWithEvents,
  getMeetingAttendanceWithMembers
};
