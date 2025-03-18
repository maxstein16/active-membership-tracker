const Error = require("./public/errors.js");
const error = new Error();
const { getOrganizationById } = require("../data-layer/organization.js");
const { getMemberById } = require("../data-layer/member.js");
const { getMeetingDetails } = require("../data-layer/reports.js");
const { getMembershipsByAttributes, getMembershipsByOrgAndSemester } = require("../data-layer/membership.js");
const { getMemberAttendanceWithEvents, getMeetingAttendanceWithMembers } = require("../data-layer/attendance.js");
const { getSemestersByYear, getCurrentSemester } = require("../data-layer/semester.js");
const { getEventsWithAttendance } = require("../data-layer/event.js");

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
    const organization = await getOrganizationById(orgId);
    
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const twoYearsAgo = lastYear - 1;

    const currentYearSemesters = await getSemestersByYear(currentYear);
    const lastYearSemesters = await getSemestersByYear(lastYear);
    
    if (!currentYearSemesters || currentYearSemesters.length === 0) {
      console.error("No semesters found for current year");
      return { error: error.noCurrentSemesterFound, data: null };
    }

    const currentYearSemesterIds = currentYearSemesters.map(sem => sem.semester_id);
    const lastYearSemesterIds = lastYearSemesters.map(sem => sem.semester_id);

    const currentYearMemberships = await getMembershipsByOrgAndSemester(orgId, currentYearSemesterIds) || [];
    const currentYearMemberIds = new Set(currentYearMemberships.map(m => m.member_id));
    
    const currentActiveMembers = currentYearMemberships.filter(m => m.active_member) || [];
    const currentActiveMemberIds = new Set(currentActiveMembers.map(m => m.member_id));
    
    const lastYearMemberships = await getMembershipsByOrgAndSemester(orgId, lastYearSemesterIds) || [];
    const lastYearMemberIds = new Set(lastYearMemberships.map(m => m.member_id));
    
    const lastYearActiveMembers = lastYearMemberships.filter(m => m.active_member) || [];
    const lastYearActiveMemberIds = new Set(lastYearActiveMembers.map(m => m.member_id));
    
    const newMemberIds = [...currentYearMemberIds].filter(id => !lastYearMemberIds.has(id));
    
    const newActiveMembers = [...currentActiveMemberIds].filter(id => !lastYearActiveMemberIds.has(id));
    
    let lastYearNewMemberIds = [];
    let lastYearNewActiveMembers = [];
    
    try {
      const twoYearsAgoSemesters = await getSemestersByYear(twoYearsAgo);
      
      if (twoYearsAgoSemesters && twoYearsAgoSemesters.length > 0) {
        const twoYearsAgoSemesterIds = twoYearsAgoSemesters.map(sem => sem.semester_id);
        
        const twoYearsAgoMemberships = await getMembershipsByOrgAndSemester(orgId, twoYearsAgoSemesterIds) || [];
        
        const twoYearsAgoMemberIds = new Set(twoYearsAgoMemberships.map(m => m.member_id));
        const twoYearsAgoActiveMembers = twoYearsAgoMemberships.filter(m => m.active_member) || [];
        const twoYearsAgoActiveMemberIds = new Set(twoYearsAgoActiveMembers.map(m => m.member_id));
        
        lastYearNewMemberIds = [...lastYearMemberIds].filter(id => !twoYearsAgoMemberIds.has(id));
        
        lastYearNewActiveMembers = [...lastYearActiveMemberIds].filter(id => !twoYearsAgoActiveMemberIds.has(id));
      }
    } catch (err) {
      console.error("Error getting two years ago data:", err);
    }

    const events = await getEventsWithAttendance(orgId);
    if (!events || events.length === 0) {
      return { error: error.databaseError, data: null };
    }

    const currentYearEvents = events.filter(e => 
      new Date(e.event_start).getFullYear() === currentYear
    );

    const lastYearEvents = events.filter(e => 
      new Date(e.event_start).getFullYear() === lastYear
    );

    const processMeetings = (eventsList) => {
      return eventsList.map(event => ({
        event_id: event.event_id,
        event_name: event.event_name,
        event_date: event.event_start,
        total_attendance: event.Attendances ? event.Attendances.length : 0,
        attendees: event.Attendances ? event.Attendances.map(a => ({
          member_id: a.member_id,
          firstName: a.Member?.member_name?.split(' ')[0] || "Unknown",
          lastName: a.Member?.member_name?.split(' ')[1] || "Unknown",
          rit_username: a.Member?.member_email?.split('@')[0] || "Unknown"
        })) : []
      }));
    };

    const categorizeEvents = (eventsList) => {
      const general = eventsList.filter(e => e.event_type === 'general meeting').length;
      const volunteering = eventsList.filter(e => e.event_type === 'volunteering').length;
      const events = eventsList.length - general - volunteering;
      
      return {
        general,
        volunteering,
        events
      };
    };

    const currentYearMeetings = processMeetings(currentYearEvents);
    const lastYearMeetings = processMeetings(lastYearEvents);
    
    const currentYearEventTypes = categorizeEvents(currentYearEvents);
    const lastYearEventTypes = categorizeEvents(lastYearEvents);

    const formatMembers = (membershipsList) => {
      return membershipsList.map(member => ({
        member_id: member?.member_id || null,
        role_num: member?.membership_role || 0,
        firstName: member?.Member?.member_name?.split(' ')[0] || "",
        lastName: member?.Member?.member_name?.split(' ')[1] || "",
        rit_username: member?.Member?.member_email?.split('@')[0] || "",
        phone: member?.Member?.member_phone_number || "",
        points: member?.membership_points || 0
      }));
    };

    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      current_year: currentYear,
      
      memberDataThis: {
        totalMembers: currentYearMemberIds.size,
        newMembers: newMemberIds.length,
        totalActive_members: currentActiveMemberIds.size,
        newActive_members: newActiveMembers.length,
        members: formatMembers(currentYearMemberships)
      },
      
      memberDataLast: {
        totalMembers: lastYearMemberIds.size,
        newMembers: lastYearNewMemberIds.length,
        totalActiveMembers: lastYearActiveMemberIds.size,
        newActiveMembers: lastYearNewActiveMembers.length,
      },

      meetingsDataThis: {
        numMeetings: currentYearEventTypes.general,
        numEvents: currentYearEventTypes.events,
        numVolunteering: currentYearEventTypes.volunteering,
        totalAttendance: currentYearMeetings.reduce((sum, m) => sum + m.total_attendance, 0),
        meetings: currentYearMeetings
      },

      meetingsDataLast: {
        numMeetings: lastYearEventTypes.general,
        numEvents: lastYearEventTypes.events,
        numVolunteering: lastYearEventTypes.volunteering,
        totalAttendance: lastYearMeetings.reduce((sum, m) => sum + m.total_attendance, 0),
        meetings: lastYearMeetings
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
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    const currentSemester = await getCurrentSemester();
    if (!currentSemester) {
      return { error: error.semesterNotFound, data: null };
    }

    const semesterMembers = await getMembershipsByOrgAndSemester(orgId, [currentSemester.semester_id]);

    if (!semesterMembers || semesterMembers.length === 0) {
      return { error: error.databaseError, data: null };
    }

    const events = await getEventsWithAttendance(orgId);

    if (!events || events.length === 0) {
      return { error: error.databaseError, data: null };
    }

    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      semester: currentSemester.semester_name,
      academic_year: currentSemester.academic_year,
      member_data: {
        total_members: semesterMembers.length,
        active_members: semesterMembers.filter(m => m.active_member).length,
        members: semesterMembers.map(member => ({
          member_id: member?.Member?.member_id || null,
          role_num: member?.membership_role || 0,
          firstName: member?.Member?.member_name?.split(' ')[0] || "",
          lastName: member?.Member?.member_name?.split(' ')[1] || "",
          rit_username: member?.Member?.member_email?.split('@')[0] || "",
          phone: member?.Member?.member_phone_number || "",
          points: member?.membership_points || 0
        }))
      },
      event_data: {
        total_events: events.length,
        total_attendance: events.reduce((sum, event) => sum + (event.Attendances ? event.Attendances.length : 0), 0)
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
    const membershipStatuses = await getMembershipsByAttributes({
        organization_id: orgId,
        member_id: attendances.map(a => a.Member.member_id),
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