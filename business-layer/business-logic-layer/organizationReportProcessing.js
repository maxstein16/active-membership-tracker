const Error = require("./public/errors.js");
const error = new Error();
const { getOrganizationById } = require("../data-layer/organization.js");
const { getMemberById } = require("../data-layer/member.js");
const { getMemberAttendanceWithEvents, getEventsWithAttendance, getSemesterEventsWithAttendance, getMeetingAttendanceWithMembers, getMembershipsByOrgAndSemester, getSemestersByYear, getCurrentYearSemesters, getCurrentSemester, getMeetingDetails } = require("../data-layer/reports.js");
const { getMembershipsByAttributes } = require("../data-layer/membership.js");
const { getAttendanceByMemberAndEvent } = require("../data-layer/attendance.js");
const { getCurrentSemesters } = require("../data-layer/semester.js");

/**
 * Get specific report data for a member in an organization
 */
async function getSpecificReportOrgDataInDB(orgId, memberId) {
  try {
    // Get organization info
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    // Get member info and attendance
    const member = await getMemberById(memberId);
    if (!member) {
      return { error: error.memberNotFound, data: null };
    }

    const memberAttendance = await getMemberAttendanceWithEvents(orgId, memberId);

    // Format response data
    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      member_data: {
        member_id: member.member_id,
        role_num: member.role_num,
        firstName: member.member_name.split(' ')[0],
        lastName: member.member_name.split(' ')[1],
        rit_username: member.member_email.split('@')[0],
        phone: member.member_phone_number
      },
      attendance_data: memberAttendance.map(att => ({
        event_id: att.Event.event_id,
        event_name: att.Event.event_name,
        event_date: att.Event.event_start,
        check_in: att.check_in
      }))
    };

    return { error: error.noError, data };
  } catch (err) {
    return { error: error.databaseError, data: null };
  }
}

/**
 * Generate annual report for organization
 */
async function getAnnualOrgReportInDB(orgId) {
  try {
    // Get organization info
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    // Get semesters for current and last year
    const currentYearSemesters = await getSemestersByYear(currentYear);
    const lastYearSemesters = await getSemestersByYear(lastYear);

    const currentYearSemesterIds = currentYearSemesters.map(s => s.semester_id);
    const lastYearSemesterIds = lastYearSemesters.map(s => s.semester_id);

    // Get members for current and last year based on semesters
    const currentYearMembers = await getMembershipsByOrgAndSemester(
      orgId, 
      currentYearSemesterIds
    );
    
    const lastYearMembers = await getMembershipsByOrgAndSemester(
      orgId, 
      lastYearSemesterIds
    );

    // Get events with attendance
    const events = await getEventsWithAttendance(orgId);
    
    // Filter events by year
    const currentYearEvents = events.filter(e => {
      const eventDate = new Date(e.event_start);
      return eventDate.getFullYear() === currentYear;
    });
    
    const lastYearEvents = events.filter(e => {
      const eventDate = new Date(e.event_start);
      return eventDate.getFullYear() === lastYear;
    });

    // Format response data
    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      current_year: currentYear,
      "member-data": {
        total_members: currentYearMembers.length,
        new_members: currentYearMembers.filter(m => 
          !lastYearMembers.some(lym => lym.member_id === m.member_id)
        ).length,
        total_active_members: currentYearMembers.filter(m => m.active_member).length,
        new_active_members: currentYearMembers.filter(m => 
          m.active_member && !lastYearMembers.some(lym => lym.member_id === m.member_id)
        ).length,
        members: currentYearMembers.map(m => ({
          member_id: m.Member.member_id,
          role_num: m.membership_role,
          firstName: m.Member.member_name.split(' ')[0],
          lastName: m.Member.member_name.split(' ')[1],
          rit_username: m.Member.member_email.split('@')[0],
          phone: m.Member.member_phone_number
        }))
      },
      "member-data-last-year": {
        total_members: lastYearMembers.length,
        new_members: lastYearMembers.length,
        total_active_members: lastYearMembers.filter(m => m.active_member).length,
        new_active_members: lastYearMembers.filter(m => m.active_member).length
      },
      "meetings_data_this_year": {
        number_of_meetings: currentYearEvents.filter(e => e.event_type === 'general_meeting').length,
        number_of_events: currentYearEvents.filter(e => e.event_type !== 'general_meeting').length,
        number_of_volunteering: currentYearEvents.filter(e => e.event_type === 'volunteer').length,
        total_attendance: currentYearEvents.reduce((sum, event) => sum + (event.Attendances ? event.Attendances.length : 0), 0)
      },
      "meetings_data_last_year": {
        number_of_meetings: lastYearEvents.filter(e => e.event_type === 'general_meeting').length,
        number_of_events: lastYearEvents.filter(e => e.event_type !== 'general_meeting').length,
        number_of_volunteering: lastYearEvents.filter(e => e.event_type === 'volunteer').length,
        total_attendance: lastYearEvents.reduce((sum, event) => sum + (event.Attendances ? event.Attendances.length : 0), 0)
      }
    };

    return { error: error.noError, data };
  } catch (err) {
    console.error("Error in getAnnualOrgReportInDB:", err);
    return { error: error.databaseError, data: null };
  }
}

/**
 * Generate semester report for organization
 */
async function getSemesterOrgReportInDB(orgId) {
  try {
    // Get organization info
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    // Get current semester
    const currentSemester = await getCurrentSemester();
    if (!currentSemester) {
      return { error: error.semesterNotFound, data: null };
    }

    // Get semester data
    const semesterMembers = await getMembershipsByOrgAndSemester(
      orgId,
      [currentSemester.semester_id]
    );

    // Get events with attendance
    const events = await getEventsWithAttendance(orgId);
    
    // Filter events for current semester
    const semesterEvents = events.filter(e => {
      const eventDate = new Date(e.event_start);
      const semesterStart = new Date(currentSemester.start_date);
      const semesterEnd = new Date(currentSemester.end_date);
      return eventDate >= semesterStart && eventDate <= semesterEnd;
    });

    // Format response data
    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      semester: currentSemester.semester_name,
      academic_year: currentSemester.academic_year,
      member_data: {
        total_members: semesterMembers.length,
        active_members: semesterMembers.filter(m => m.active_member).length,
        members: semesterMembers.map(m => ({
          member_id: m.Member.member_id,
          role_num: m.membership_role,
          firstName: m.Member.member_name.split(' ')[0],
          lastName: m.Member.member_name.split(' ')[1],
          rit_username: m.Member.member_email.split('@')[0],
          phone: m.Member.member_phone_number,
          points: m.membership_points
        }))
      },
      event_data: {
        total_events: semesterEvents.length,
        events_by_type: {
          general_meetings: semesterEvents.filter(e => e.event_type === 'general_meeting').length,
          volunteer: semesterEvents.filter(e => e.event_type === 'volunteer').length,
          social: semesterEvents.filter(e => e.event_type === 'social').length,
          workshop: semesterEvents.filter(e => e.event_type === 'workshop').length,
          fundraiser: semesterEvents.filter(e => e.event_type === 'fundraiser').length,
          committee: semesterEvents.filter(e => e.event_type === 'committee').length
        },
        total_attendance: semesterEvents.reduce((sum, event) => 
          sum + (event.Attendances ? event.Attendances.length : 0), 0
        )
      }
    };

    return { error: error.noError, data };
  } catch (err) {
    console.error("Error in getSemesterOrgReportInDB:", err);
    return { error: error.databaseError, data: null };
  }
}

/**
 * Generate meeting report for organization
 */
async function getMeetingOrgReportInDB(orgId, meetingId) {
  try {
    // Get organization info
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    // Get meeting info
    const meeting = await getMeetingDetails(orgId, meetingId);
    if (!meeting) {
      return { error: error.eventNotFound, data: null };
    }

    // Get attendance and member info
    const attendances = await getMeetingAttendanceWithMembers(meetingId);
    const memberIds = attendances.map(a => a.Member.member_id);
    const membershipStatuses = await getMembershipsByAttributes({
      organization_id: orgId,
      member_id: memberIds
    });

    // Format response data
    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      meeting_id: meeting.event_id,
      meeting_type: meeting.event_type,
      meeting_date: meeting.event_start,
      meeting_name: meeting.event_name,
      meeting_location: meeting.event_location,
      meeting_description: meeting.event_description,
      attendance: {
        total_attendance: attendances.length,
        active_member_attendance: membershipStatuses.filter(m => m.active_member).length,
        inactive_member_attendance: membershipStatuses.filter(m => !m.active_member).length,
        members_who_attended: attendances.map(att => {
          const membership = membershipStatuses.find(m => m.member_id === att.Member.member_id);
          return {
            member_id: att.Member.member_id,
            role_num: membership ? membership.membership_role : 0,
            firstName: att.Member.member_name.split(' ')[0],
            lastName: att.Member.member_name.split(' ')[1],
            rit_username: att.Member.member_email.split('@')[0],
            phone: att.Member.member_phone_number
          };
        })
      }
    };

    return { error: error.noError, data };
  } catch (err) {
    console.error("Error in getMeetingOrgReportInDB:", err);
    return { error: error.databaseError, data: null };
  }
}

module.exports = {
  getSpecificReportOrgDataInDB,
  getAnnualOrgReportInDB,
  getSemesterOrgReportInDB,
  getMeetingOrgReportInDB
};