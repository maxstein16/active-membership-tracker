const { createAttendance, getAttendanceById, getAttendanceByMemberAndEvent, getAttendanceByEventId, getAttendanceByMemberId } = require("../data-layer/attendance.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * ATTENDANCE TABLE ATTRIBUTES (Based on DB):
 * - attendance_id
 * - member_id
 * - event_id
 * - check_in
 * - volunteer_hours
 */

/**
 * Create a new attendance. IDs should be auto-generated, hence not in the params.
 * @param {Object} attendanceData - The data to create the attendance record
 * @returns {Promise<Object>} Object containing error and data properties
 */
const createAttendanceDB = async (attendanceData) => {
    try {
        const newAttendance = await createAttendance(attendanceData);
        return { error: error.noError, data: newAttendance };
    } catch (err) {
        console.error("Error creating attendance:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

/**
 * Get attendance info from a specific ID.
 * @param {number} attendanceId - The ID of the attendance record
 * @returns {Promise<Object>} Object containing error and data properties
 */
const getAttendanceByIdDB = async (attendanceId) => {
    if (isNaN(attendanceId)) {
        return { error: error.attendanceIdMustBeInteger, data: null };
    }

    try {
        const attendance = await getAttendanceById(attendanceId);
        if (!attendance) {
            return { error: error.attendanceNotFound, data: null };
        }
        return { error: error.noError, data: attendance };
    } catch (err) {
        console.error("Error fetching attendance by ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}; // getAttendanceById

/**
 * Get attendance(s) of a specific member noted by their ID.
 * @param {number} memberId - The ID of the member
 * @returns {Promise<Object>} Object containing error and data properties
 */
const getAttendanceByMemberIdDB = async (memberId) => {
    try {
        const attendance = await getAttendanceByMemberId(memberId);
        if (!attendance || attendance.length === 0) {
            return { error: error.eventNotFound, data: null };
        }

        return { error: error.noError, data: attendance };
    } catch (err) {
        console.error("Error fetching attendance by member ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}; // getAttendanceByMemberId

/**
 * Retrieves the attendance of a specific member at a specific event.
 * @param {number} memberId - The ID of the member
 * @param {number} eventId - The ID of the event
 * @returns {Promise<Object>} Object containing error and data properties
 */
const getAttendanceByMemberAndEventDB = async (memberId, eventId) => {
    try {
        const attendance = await getAttendanceByMemberAndEvent(memberId, eventId);
        if (!attendance) {
            return { error: error.eventNotFound, data: null };
        }

        return { error: error.noError, data: attendance };
    } catch (err) {
        console.error("Error fetching attendance by Member and Event ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}; // getAttendanceByMemberAndEvent

module.exports = {
    createAttendanceDB,
    getAttendanceByIdDB,
    getAttendanceByMemberIdDB,
    getAttendanceByMemberAndEventDB
};