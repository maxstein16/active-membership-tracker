const { Event, Member, Attendance } = require("../db"); // Import models
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
 */
async function createAttendance(attendanceData) {
    try {
        const newAttendance = await Attendance.create({
            member_id: attendanceData.member_id,
            event_id: attendanceData.event_id,
            check_in: attendanceData.check_in,
            volunteer_hours: attendanceData.volunteer_hours,
        });

        return { error: error.noError, data: newAttendance };
    } catch (err) {
        console.error("Error creating attendance:", err);
        return { error: error.somethingWentWrong, data: null };
    }
} // createAttendance

/**
 * Get attendance info from a specific ID.
 */
async function getAttendanceById(attendanceId) {
    if (isNaN(attendanceId)) {
        return { error: error.attendanceIdMustBeInteger, data: null };
    }

    try {
        const attendance = await Attendance.findByPk(attendanceId);
        if (!attendance) {
            return { error: error.attendanceNotFound, data: null };
        }
        return { error: null, data: attendance.toJSON() };
    } catch (err) {
        console.error("Error fetching attendance by ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
} // getAttendanceById

/**
 * Get attendance(s) of a specific member noted by their ID.
 */
async function getAttendanceByMemberId(memberId) {
    try {
        const attendance = await Attendance.findAll({
            where: { member_id: memberId },
            include: [
                {
                    model: Member,
                    attributes: ["member_id", "member_name", "member_email"], // Can add more fields if needed
                },
            ],
        });

        if (attendance.length === 0) {
            return { error: error.eventNotFound, data: null };
        }

        return { error: error.noError, data: attendance };
    } catch (err) {
        console.error("Error fetching attendance by member ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
} // getAttendanceByMemberId

/**
 * Retrieves attendance records for a specific event.
 * 
 * @param {number} eventId - The unique identifier of the event.
 * @returns {Promise<Object>} - A promise resolving to an object containing attendance data or an error.
 */
async function getAttendanceByEventId(eventId) {
    try {
        const attendance = await Attendance.findAll({
            where: { event_id: eventId },
            include: [
                {
                    model: Event,
                    attributes: [], // Excludes all attributes from Event but could be some if we wanted to
                },
            ],
        });

        if (attendance.length === 0) {
            return { error: error.eventNotFound, data: null };
        }

        return { error: error.noError, data: attendance };
    } catch (err) {
        console.error("Error fetching attendance by Event ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
} // getAttendanceByEventId

/**
 * Retrieves the attendance of a specific member at a specific event.
 * @param {number} memberId 
 * @param {number} eventId 
 * @returns {Promise<Object>} A promise of an object containing attendance data, member info, and event info.
 */
async function getAttendanceByMemberAndEvent(memberId, eventId) {
    try {
        const attendance = await Attendance.findOne({
            where: { member_id: memberId, event_id: eventId },
            include: [
                {
                    model: Member,
                    attributes: ["member_name", "member_email"],
                },
                {
                    model: Event,
                    attributes: ["event_name", "event_date"],
                },
            ],
        });

        if (!attendance) {
            return { error: error.eventNotFound, data: null };
        }

        return { error: error.noError, data: attendance };
    } catch (err) {
        console.error("Error fetching attendance by Member and Event ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
} // getAttendanceByMemberAndEvent

module.exports = {
    createAttendance,
    getAttendanceById,
    getAttendanceByMemberId,
    getAttendanceByEventId,
    getAttendanceByMemberAndEvent
};
