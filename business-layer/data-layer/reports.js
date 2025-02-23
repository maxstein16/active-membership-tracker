const { Event, Attendance, Member, Membership, Semester } = require("../db");

async function getEventsWithAttendance(orgId) {
  try {
    const events = await Event.findAll({
      where: { organization_id: orgId },
      include: {
        model: Attendance,
        as: 'Attendances'
      }
    });
    return events;
  } catch (err) {
    console.error("Error in getEventsWithAttendance:", err);
    throw err;
  }
}

async function getMembershipsByOrgAndSemester(orgId, semesterIds) {
  try {
    const memberships = await Membership.findAll({
      where: { 
        organization_id: orgId,
        semester_id: semesterIds
      },
      include: [{
        model: Member,
        required: true
      }]
    });
    
    return memberships;
  } catch (err) {
    console.error("Error in getMembershipsByOrgAndSemester:", err);
    throw err;
  }
}

async function getCurrentSemester() {
  try {
    const allSemesters = await Semester.findAll({
      order: [['semester_id', 'DESC']] // Get most recent semester first
    });

    if (!allSemesters || allSemesters.length === 0) {
      throw new Error("No semesters found");
    }

    const now = new Date();
    // Find the current semester where now is between start_date and end_date
    const currentSemester = allSemesters.find(semester => {
      const startDate = new Date(semester.start_date);
      const endDate = new Date(semester.end_date);
      return now >= startDate && now <= endDate;
    });

    return currentSemester || allSemesters[0]; // Return most recent if no current semester
  } catch (err) {
    console.error("Error in getCurrentSemester:", err);
    throw err;
  }
}

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

async function getSemesterEventsWithAttendance(orgId, semesterId) {
  try {
    const events = await Event.findAll({
      where: {
        organization_id: orgId,
        semester_id: semesterId
      },
      include: {
        model: Attendance,
        as: 'Attendances',
        required: false
      }
    });
    return events;
  } catch (err) {
    console.error("Error in getSemesterEventsWithAttendance:", err);
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

async function getMeetingDetails(orgId, meetingId) {
  try {
    const event = await Event.findOne({
      where: { 
        event_id: meetingId,
        organization_id: orgId
      }
    });
    return event;
  } catch (err) {
    console.error("Error in getMeetingDetails:", err);
    throw err;
  }
}

async function getSemestersByYear(year = new Date().getFullYear()) {
  try {
    if (!year) return [];
    
    const allSemesters = await Semester.findAll();
    if (!allSemesters || allSemesters.length === 0) return [];
    
    // For a given year (e.g., 2024), match academic years like "2024-2025" or "2023-2024"
    return allSemesters.filter(semester => {
      if (!semester.academic_year) return false;
      const [startYear, endYear] = semester.academic_year.split('-');
      return startYear === year.toString() || endYear === year.toString();
    });
  } catch (err) {
    console.error("Error in getSemestersByYear:", err);
    throw err;
  }
}

module.exports = {
  getMemberAttendanceWithEvents,
  getMembershipsByOrgAndSemester,
  getEventsWithAttendance,
  getSemesterEventsWithAttendance,
  getMeetingAttendanceWithMembers,
  getCurrentSemester,
  getSemestersByYear,
  getMeetingDetails
};