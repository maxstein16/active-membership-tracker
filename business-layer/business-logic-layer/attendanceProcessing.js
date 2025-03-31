const {
  createAttendance,
  getAttendanceById,
  getAttendanceByMemberAndEvent,
  getAttendanceByMemberId,
} = require("../data-layer/attendance.js");
const {
  getEventsByAttributes,
  getAttendanceByEventId,
} = require("../data-layer/event.js");
const { getMemberById } = require("../data-layer/member.js");
const { getMembershipByAttributes } = require("../data-layer/membership.js");
const {
  getOrganizationById,
} = require("../data-layer/organization.js");
const {
  editMemberInOrganizationInDB,
} = require("./organizationMemberProcessing.js");
const {
  checkActiveMembership,
} = require("./organizationMembershipProcessing.js");
const {
  getBasePointsForEventType,
  calculateBonusPoints,
} = require("./organizationSettingsProcessing.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * ATTENDANCE TABLE ATTRIBUTES (Based on DB):
 * - attendance_id
 * - member_id
 * - event_id
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
 * Create attendance and handle point allocation and membership status update
 * @param {Object} attendanceData - Contains event_id and member_id
 * @param {string} eventType - Type of event (e.g., "General Meeting")
 * @param {number} orgId - Organization ID
 */
const processAttendance = async (attendanceData, eventType, orgId) => {
  try {
    const attendance = await createAttendance(attendanceData);

    const organization = await getOrganizationById(orgId);
    if (!organization) throw new Error("Organization not found.");

    const membership = await getMembershipByAttributes({
      member_id: attendanceData.member_id,
      organization_id: orgId,
    });

    // Check if a membership was found
    if (!membership) {
      throw new Error("Membership not found.");
    } else {
      console.log("Membership is", membership.get({ plain: true }));
    }


    // Step 4: If points-based, calculate and allocate points
    if (organization.organization_membership_type === "points") {
      const basePoints = await getBasePointsForEventType(eventType, orgId);
      const bonusPoints = await calculateBonusPoints(
        attendanceData.member_id,
        orgId,
        eventType,
        membership.membership_id
      );

      const totalPoints =
        membership.membership_points + basePoints + bonusPoints;
      await editMemberInOrganizationInDB(orgId, attendanceData.member_id, {
        membership_points: totalPoints,
      });
    } else {
      // Step 5: Attendance-based - check active membership
      checkActiveMembership(membership);
      console.log("checkign active membership")
    }

    return { error: error.noError, data: attendance };
  } catch (err) {
    console.error("Error processing attendance:", err);
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
    const membershipStatus = await getMembershipByAttributes(memberId);

    // Filter by semester if specified
    const filteredRecords = semesterId
      ? attendanceRecords.filter((record) => record.semester_id === semesterId)
      : attendanceRecords;

    // Calculate statistics
    const stats = {
      totalEventsAttended: filteredRecords.length,
      membershipStatus: membershipStatus,
      attendanceHistory: filteredRecords.map((record) => ({
        eventId: record.event_id,
        semesterId: record.semester_id,
      })),
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
    const semesterEvents = await getEventsByAttributes(semesterId);
    const memberAttendance = await getAttendanceByMemberId(memberId);

    const filteredAttendance = memberAttendance.filter((attendance) =>
      semesterEvents.some((event) => event.event_id === attendance.event_id)
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

/**
 * Get attendees details for a specific event
 * @param {number} eventId - The ID of the event
 * @returns {Promise<Object>} Object containing error and attendees data
 */
const getAttendeesDetailsByEventIdDB = async (eventId) => {
  try {
    // Validate event ID
    if (isNaN(eventId)) {
      return { error: error.eventIdMustBeInteger, data: null };
    }

    // Get attendance records for the event
    const attendanceRecords = await getAttendanceByEventId(eventId);

    // If no attendance records found
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return { error: error.noAttendanceFound, data: [] };
    }

    // Map attendance records to include member details
    const attendeesDetails = await Promise.all(
      attendanceRecords.map(async (record) => {
        // Fetch member details for each attendance record
        const memberDetails = await getMemberById(record.member_id);

        return {
          member_id: record.member_id,
          member_name: memberDetails.member_name,
          member_email: memberDetails.member_email,
          checkIn: record.check_in,
          volunteerHours: record.volunteer_hours,
          pointsEarned: record.points_earned || 0,
        };
      })
    );

    return {
      error: error.noError,
      data: attendeesDetails,
    };
  } catch (err) {
    console.error("Error fetching attendees details by event ID:", err);
    return { error: error.somethingWentWrong, data: null };
  }
};

module.exports = {
  createAttendanceDB,
  processAttendance,
  getAttendanceByIdDB,
  getMemberAttendanceStatsDB,
  getAttendanceByMemberAndEventDB,
  getMemberAttendanceBySemesterDB,
  getAttendeesDetailsByEventIdDB,
};
