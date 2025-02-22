const {
    createAttendance,
    getAttendanceById,
    getAttendanceByMemberAndEvent,
    getAttendanceByEventId,
    getAttendanceByMemberId,
    getMembershipStatus,
    getEventsBySemester
} = require("../data-layer/attendance.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * ATTENDANCE TABLE ATTRIBUTES (Based on DB):
 * - attendance_id
 * - member_id
 * - event_id
 * - check_in
 * - volunteer_hours
 * - semester_id (new field to support semester filtering)
 * - points_earned (new field to track points per event)
 */

/**
 * Create a new attendance record
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
 * Get attendance info from a specific ID
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
};

/**
 * Get comprehensive member attendance statistics
 * @param {number} memberId - The ID of the member
 * @param {number} [semesterId] - Optional semester ID for filtering
 * @returns {Promise<Object>} Object containing error and attendance statistics
 */
const getMemberAttendanceStatsDB = async (memberId, semesterId = null) => {
    try {
        // Get basic attendance records
        const attendanceRecords = await getAttendanceByMemberId(memberId);
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return { error: error.noAttendanceFound, data: null };
        }

        // Get membership status
        const membershipStatus = await getMembershipStatus(memberId);

        // Filter by semester if specified
        const filteredRecords = semesterId
            ? attendanceRecords.filter(record => record.semester_id === semesterId)
            : attendanceRecords;

        // Calculate statistics
        const stats = {
            totalEventsAttended: filteredRecords.length,
            totalVolunteerHours: filteredRecords.reduce((sum, record) => sum + record.volunteer_hours, 0),
            totalPointsAccumulated: filteredRecords.reduce((sum, record) => sum + record.points_earned, 0),
            membershipStatus: membershipStatus,
            attendanceHistory: filteredRecords.map(record => ({
                eventId: record.event_id,
                checkIn: record.check_in,
                volunteerHours: record.volunteer_hours,
                pointsEarned: record.points_earned,
                semesterId: record.semester_id
            }))
        };

        return { error: error.noError, data: stats };
    } catch (err) {
        console.error("Error fetching member attendance statistics:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

/**
 * Get member attendance for a specific event
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
};

/**
 * Get member attendance filtered by semester
 * @param {number} memberId - The ID of the member
 * @param {number} semesterId - The ID of the semester
 * @returns {Promise<Object>} Object containing error and filtered attendance data
 */
const getMemberAttendanceBySemesterDB = async (memberId, semesterId) => {
    try {
        const semesterEvents = await getEventsBySemester(semesterId);
        const memberAttendance = await getAttendanceByMemberId(memberId);

        const filteredAttendance = memberAttendance.filter(attendance => 
            semesterEvents.some(event => event.event_id === attendance.event_id)
        );

        if (filteredAttendance.length === 0) {
            return { error: error.noAttendanceFound, data: null };
        }

        return { error: error.noError, data: filteredAttendance };
    } catch (err) {
        console.error("Error fetching attendance by semester:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

module.exports = {
    createAttendanceDB,
    getAttendanceByIdDB,
    getMemberAttendanceStatsDB,
    getAttendanceByMemberAndEventDB,
    getMemberAttendanceBySemesterDB
};