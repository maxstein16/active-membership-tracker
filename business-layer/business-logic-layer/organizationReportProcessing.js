const Error = require("./public/errors.js");
const error = new Error();
const { getOrganizationById } = require("../data-layer/organization.js");
const { getMemberById } = require("../data-layer/member.js");
const { getMembershipsByAttributes, getMembershipsByOrgAndSemester } = require("../data-layer/membership.js");
const { getMemberAttendanceWithEvents, getEventAttendanceWithMembers } = require("../data-layer/attendance.js");
const { getSemestersByYear, getCurrentSemester } = require("../data-layer/semester.js");
const { getEventsWithAttendance, getEventById } = require("../data-layer/event.js");
const { Semester } = require("../db.js");

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
    const twoYearsAgo = lastYear - 1;

    // Check if this is a new organization
    const orgCreationDate = new Date(organization.createdAt || organization.created_at);
    const orgCreationYear = orgCreationDate.getFullYear();
    const isNewOrg = orgCreationYear === currentYear;

    // Get semesters for current and last year
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
    
    let lastYearMemberships = [];
    let lastYearMemberIds = new Set();
    let lastYearActiveMembers = [];
    let lastYearActiveMemberIds = new Set();
    let newMemberIds = [];
    let newActiveMembers = [];
    let lastYearNewMemberIds = [];
    let lastYearNewActiveMembers = [];

    // Only process historical data if this is not a new organization
    if (!isNewOrg) {
      lastYearMemberships = await getMembershipsByOrgAndSemester(orgId, lastYearSemesterIds) || [];
      lastYearMemberIds = new Set(lastYearMemberships.map(m => m.member_id));
      
      lastYearActiveMembers = lastYearMemberships.filter(m => m.active_member) || [];
      lastYearActiveMemberIds = new Set(lastYearActiveMembers.map(m => m.member_id));
      
      newMemberIds = [...currentYearMemberIds].filter(id => !lastYearMemberIds.has(id));
      
      newActiveMembers = [...currentActiveMemberIds].filter(id => !lastYearActiveMemberIds.has(id));
      
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
    } else {
      // For new organizations, all members are new
      newMemberIds = [...currentYearMemberIds];
      newActiveMembers = [...currentActiveMemberIds];
    }

    // Get events with attendance
    const events = await getEventsWithAttendance(orgId);
    if (!events) {
      // For new organizations, there might not be any events yet
      if (isNewOrg) {
        // Return with empty events data but no error
        const data = {
          organization_id: organization.organization_id,
          organization_name: organization.organization_name,
          organization_abbreviation: organization.organization_abbreviation,
          current_year: currentYear,
          isNewOrg: true,
          
          memberDataThis: {
            totalMembers: currentYearMemberIds.size,
            newMembers: newMemberIds.length,
            totalActive_members: currentActiveMemberIds.size,
            newActive_members: newActiveMembers.length,
            members: formatMembers(currentYearMemberships)
          },
          
          memberDataLast: null,
          meetingsDataThis: {
            numMeetings: 0,
            numEvents: 0,
            numVolunteering: 0,
            totalAttendance: 0,
            meetings: []
          },
          meetingsDataLast: null
        };
        
        return { error: error.noError, data };
      }
      return { error: error.databaseError, data: null };
    }

    const currentYearEvents = events.filter(e => 
      new Date(e.event_start).getFullYear() === currentYear
    );

    const lastYearEvents = isNewOrg ? [] : events.filter(e => 
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
    const lastYearMeetings = isNewOrg ? [] : processMeetings(lastYearEvents);
    
    const currentYearEventTypes = categorizeEvents(currentYearEvents);
    const lastYearEventTypes = isNewOrg ? { general: 0, volunteering: 0, events: 0 } : categorizeEvents(lastYearEvents);

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
      isNewOrg: isNewOrg,
      
      memberDataThis: {
        totalMembers: currentYearMemberIds.size,
        newMembers: newMemberIds.length,
        totalActive_members: currentActiveMemberIds.size,
        newActive_members: newActiveMembers.length,
        members: formatMembers(currentYearMemberships)
      },
      
      memberDataLast: isNewOrg ? null : {
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

      // If this is a new org, set meetingsDataLast to null instead of empty data
      meetingsDataLast: isNewOrg ? null : {
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

async function getAnnualOrgReportByYearInDB(orgId, year) {
  try {
    // Get organization info
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    // Check if organization existed in the requested year
    const orgCreationDate = new Date(organization.createdAt || organization.created_at);
    const orgCreationYear = orgCreationDate.getFullYear();
    const isNewOrg = year < orgCreationYear;
    const previousYear = year - 1;

    // Get semesters for the specified year
    const yearSemesters = await getSemestersByYear(year);
    const previousYearSemesters = await getSemestersByYear(previousYear);
    
    if (!yearSemesters || yearSemesters.length === 0) {
      console.error(`No semesters found for year ${year}`);
      return { error: error.noSemestersFoundForYear, data: null };
    }

    const yearSemesterIds = yearSemesters.map(sem => sem.semester_id);
    const previousYearSemesterIds = previousYearSemesters.map(sem => sem.semester_id);

    // For a new org or requesting data from before the org existed
    if (isNewOrg) {
      const data = {
        organization_id: organization.organization_id,
        organization_name: organization.organization_name,
        organization_abbreviation: organization.organization_abbreviation,
        current_year: year,
        isNewOrg: true,
        memberDataThis: {
          totalMembers: 0,
          newMembers: 0,
          totalActive_members: 0,
          newActive_members: 0,
          members: []
        },
        memberDataLast: null,
        meetingsDataThis: {
          numMeetings: 0,
          numEvents: 0,
          numVolunteering: 0,
          totalAttendance: 0,
          meetings: []
        },
        meetingsDataLast: null
      };
      
      return { error: error.noError, data };
    }

    // Continue with normal data fetching for existing organizations
    const yearMemberships = await getMembershipsByOrgAndSemester(orgId, yearSemesterIds) || [];
    const yearMemberIds = new Set(yearMemberships.map(m => m.member_id));
    
    const yearActiveMembers = yearMemberships.filter(m => m.active_member) || [];
    const yearActiveMemberIds = new Set(yearActiveMembers.map(m => m.member_id));
    
    const previousYearMemberships = await getMembershipsByOrgAndSemester(orgId, previousYearSemesterIds) || [];
    const previousYearMemberIds = new Set(previousYearMemberships.map(m => m.member_id));
    
    const previousYearActiveMembers = previousYearMemberships.filter(m => m.active_member) || [];
    const previousYearActiveMemberIds = new Set(previousYearActiveMembers.map(m => m.member_id));
    
    const newMemberIds = [...yearMemberIds].filter(id => !previousYearMemberIds.has(id));
    
    const newActiveMembers = [...yearActiveMemberIds].filter(id => !previousYearActiveMemberIds.has(id));

    // Get events with attendance
    const events = await getEventsWithAttendance(orgId);
    if (!events || events.length === 0) {
      return { error: error.databaseError, data: null };
    }

    const yearEvents = events.filter(e => 
      new Date(e.event_start).getFullYear() === year
    );

    const previousYearEvents = events.filter(e => 
      new Date(e.event_start).getFullYear() === previousYear
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

    const yearMeetings = processMeetings(yearEvents);
    const previousYearMeetings = processMeetings(previousYearEvents);
    
    const yearEventTypes = categorizeEvents(yearEvents);
    const previousYearEventTypes = categorizeEvents(previousYearEvents);

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
      current_year: year,
      
      memberDataThis: {
        totalMembers: yearMemberIds.size,
        newMembers: newMemberIds.length,
        totalActive_members: yearActiveMemberIds.size,
        newActive_members: newActiveMembers.length,
        members: formatMembers(yearMemberships)
      },
      
      memberDataLast: {
        totalMembers: previousYearMemberIds.size,
        newMembers: 0, // We don't have data for previous year's new members
        totalActiveMembers: previousYearActiveMemberIds.size,
        newActiveMembers: 0, // We don't have data for previous year's new active members
      },

      meetingsDataThis: {
        numMeetings: yearEventTypes.general,
        numEvents: yearEventTypes.events,
        numVolunteering: yearEventTypes.volunteering,
        totalAttendance: yearMeetings.reduce((sum, m) => sum + m.total_attendance, 0),
        meetings: yearMeetings
      },

      meetingsDataLast: {
        numMeetings: previousYearEventTypes.general,
        numEvents: previousYearEventTypes.events,
        numVolunteering: previousYearEventTypes.volunteering,
        totalAttendance: previousYearMeetings.reduce((sum, m) => sum + m.total_attendance, 0),
        meetings: previousYearMeetings
      }
    };

    return { error: error.noError, data };
  } catch (err) {
    console.error(`Error in getAnnualOrgReportByYearInDB for year ${year}:`, err);
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

    const allSemesters = await Semester.findAll({
      order: [['start_date', 'DESC']]
    });
    
    const currentSemesterIndex = allSemesters.findIndex(sem => 
      sem.semester_id === currentSemester.semester_id
    );
    
    const previousSemester = currentSemesterIndex >= 0 && currentSemesterIndex < allSemesters.length - 1 
      ? allSemesters[currentSemesterIndex + 1] 
      : null;

    const currentSemesterMembers = await getMembershipsByOrgAndSemester(orgId, [currentSemester.semester_id]);
    if (!currentSemesterMembers) {
      return { error: error.databaseError, data: null };
    }

    let previousSemesterMembers = [];
    if (previousSemester) {
      previousSemesterMembers = await getMembershipsByOrgAndSemester(orgId, [previousSemester.semester_id]) || [];
    }

    const allEvents = await getEventsWithAttendance(orgId);
    if (!allEvents) {
      return { error: error.databaseError, data: null };
    }

    const currentSemesterStartDate = new Date(currentSemester.start_date);
    const currentSemesterEndDate = new Date(currentSemester.end_date);
    
    let previousSemesterStartDate, previousSemesterEndDate;
    if (previousSemester) {
      previousSemesterStartDate = new Date(previousSemester.start_date);
      previousSemesterEndDate = new Date(previousSemester.end_date);
    }

    const currentSemesterEvents = allEvents.filter(event => {
      const eventDate = new Date(event.event_start);
      return eventDate >= currentSemesterStartDate && eventDate <= currentSemesterEndDate;
    });

    const previousSemesterEvents = previousSemester ? allEvents.filter(event => {
      const eventDate = new Date(event.event_start);
      return eventDate >= previousSemesterStartDate && eventDate <= previousSemesterEndDate;
    }) : [];

    const currentActiveMemberIds = new Set(currentSemesterMembers
      .filter(m => m.active_member)
      .map(m => m.member_id)
    );

    const previousMemberIds = new Set(previousSemesterMembers.map(m => m.member_id));
    const previousActiveMemberIds = new Set(previousSemesterMembers
      .filter(m => m.active_member)
      .map(m => m.member_id)
    );

    const newMemberIds = currentSemesterMembers
      .filter(m => !previousMemberIds.has(m.member_id))
      .map(m => m.member_id);

    const newActiveMembers = [...currentActiveMemberIds]
      .filter(id => !previousActiveMemberIds.has(id));

    const currentSemesterEventCounts = {
      generalMeetings: currentSemesterEvents.filter(e => e.event_type === 'general meeting').length,
      volunteeringEvents: currentSemesterEvents.filter(e => e.event_type === 'volunteering').length,
      otherEvents: currentSemesterEvents.filter(e => 
        e.event_type !== 'general meeting' && e.event_type !== 'volunteering'
      ).length
    };

    const previousSemesterEventCounts = {
      generalMeetings: previousSemesterEvents.filter(e => e.event_type === 'general meeting').length,
      volunteeringEvents: previousSemesterEvents.filter(e => e.event_type === 'volunteering').length,
      otherEvents: previousSemesterEvents.filter(e => 
        e.event_type !== 'general meeting' && e.event_type !== 'volunteering'
      ).length
    };

    const currentSemesterTotalAttendance = currentSemesterEvents.reduce((sum, event) => 
      sum + (event.Attendances ? event.Attendances.length : 0), 0
    );

    const previousSemesterTotalAttendance = previousSemesterEvents.reduce((sum, event) => 
      sum + (event.Attendances ? event.Attendances.length : 0), 0
    );

    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      semester: currentSemester.semester_name,
      academic_year: currentSemester.academic_year,
      semester_start_date: currentSemester.start_date,
      semester_end_date: currentSemester.end_date,
      
      member_data: {
        total_members: currentSemesterMembers.length,
        active_members: currentSemesterMembers.filter(m => m.active_member).length,
        new_members: newMemberIds.length,
        new_active_members: newActiveMembers.length,
        members: currentSemesterMembers.map(member => ({
          member_id: member?.Member?.member_id || null,
          role_num: member?.membership_role || 0,
          firstName: member?.Member?.member_name?.split(' ')[0] || "",
          lastName: member?.Member?.member_name?.split(' ')[1] || "",
          rit_username: member?.Member?.member_email?.split('@')[0] || "",
          phone: member?.Member?.member_phone_number || "",
          points: member?.membership_points || 0
        }))
      },
      
      previous_semester: previousSemester ? {
        semester_name: previousSemester.semester_name,
        academic_year: previousSemester.academic_year,
        total_members: previousSemesterMembers.length,
        active_members: previousSemesterMembers.filter(m => m.active_member).length,
        new_members: 0, // Would need additional historical data to calculate accurately
        new_active_members: 0, // Would need additional historical data to calculate accurately
        general_meetings: previousSemesterEventCounts.generalMeetings,
        events: previousSemesterEventCounts.otherEvents,
        volunteering_events: previousSemesterEventCounts.volunteeringEvents,
        total_attendance: previousSemesterTotalAttendance
      } : null,
      
      event_data: {
        total_events: currentSemesterEvents.length,
        general_meetings: currentSemesterEventCounts.generalMeetings,
        events: currentSemesterEventCounts.otherEvents,
        volunteering_events: currentSemesterEventCounts.volunteeringEvents, 
        total_attendance: currentSemesterTotalAttendance
      }
    };

    return { error: error.noError, data };
  } catch (err) {
    console.error("Error in getSemesterOrgReportInDB:", err);
    return { error: error.databaseError, data: null };
  }
}

/**
 * Generate semester report for organization by specific semester ID
 * @param {number} orgId - The organization ID
 * @param {number} semesterId - The semester ID to get report for
 * @returns {object} Error and data object
 */
async function getSemesterOrgReportBySemesterIdInDB(orgId, semesterId) {
  try {
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      return { error: error.semesterNotFound, data: null };
    }

    const allSemesters = await Semester.findAll({
      order: [['start_date', 'DESC']]
    });
    
    const semesterIndex = allSemesters.findIndex(sem => 
      sem.semester_id === semester.semester_id
    );
    
    const previousSemester = semesterIndex >= 0 && semesterIndex < allSemesters.length - 1 
      ? allSemesters[semesterIndex + 1] 
      : null;

    const semesterMembers = await getMembershipsByOrgAndSemester(orgId, [semester.semester_id]);
    if (!semesterMembers) {
      return { error: error.databaseError, data: null };
    }

    let previousSemesterMembers = [];
    if (previousSemester) {
      previousSemesterMembers = await getMembershipsByOrgAndSemester(orgId, [previousSemester.semester_id]) || [];
    }

    const allEvents = await getEventsWithAttendance(orgId);
    if (!allEvents) {
      return { error: error.databaseError, data: null };
    }

    const semesterStartDate = new Date(semester.start_date);
    const semesterEndDate = new Date(semester.end_date);
    
    let previousSemesterStartDate, previousSemesterEndDate;
    if (previousSemester) {
      previousSemesterStartDate = new Date(previousSemester.start_date);
      previousSemesterEndDate = new Date(previousSemester.end_date);
    }

    const semesterEvents = allEvents.filter(event => {
      const eventDate = new Date(event.event_start);
      return eventDate >= semesterStartDate && eventDate <= semesterEndDate;
    });

    const previousSemesterEvents = previousSemester ? allEvents.filter(event => {
      const eventDate = new Date(event.event_start);
      return eventDate >= previousSemesterStartDate && eventDate <= previousSemesterEndDate;
    }) : [];

    const activeMemberIds = new Set(semesterMembers
      .filter(m => m.active_member)
      .map(m => m.member_id)
    );

    const previousMemberIds = new Set(previousSemesterMembers.map(m => m.member_id));
    const previousActiveMemberIds = new Set(previousSemesterMembers
      .filter(m => m.active_member)
      .map(m => m.member_id)
    );

    const newMemberIds = semesterMembers
      .filter(m => !previousMemberIds.has(m.member_id))
      .map(m => m.member_id);

    const newActiveMembers = [...activeMemberIds]
      .filter(id => !previousActiveMemberIds.has(id));

    const semesterEventCounts = {
      generalMeetings: semesterEvents.filter(e => e.event_type === 'general meeting').length,
      volunteeringEvents: semesterEvents.filter(e => e.event_type === 'volunteering').length,
      otherEvents: semesterEvents.filter(e => 
        e.event_type !== 'general meeting' && e.event_type !== 'volunteering'
      ).length
    };

    const previousSemesterEventCounts = {
      generalMeetings: previousSemesterEvents.filter(e => e.event_type === 'general meeting').length,
      volunteeringEvents: previousSemesterEvents.filter(e => e.event_type === 'volunteering').length,
      otherEvents: previousSemesterEvents.filter(e => 
        e.event_type !== 'general meeting' && e.event_type !== 'volunteering'
      ).length
    };

    const semesterTotalAttendance = semesterEvents.reduce((sum, event) => 
      sum + (event.Attendances ? event.Attendances.length : 0), 0
    );

    const previousSemesterTotalAttendance = previousSemesterEvents.reduce((sum, event) => 
      sum + (event.Attendances ? event.Attendances.length : 0), 0
    );

    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      semester: semester.semester_name,
      academic_year: semester.academic_year,
      semester_start_date: semester.start_date,
      semester_end_date: semester.end_date,
      
      member_data: {
        total_members: semesterMembers.length,
        active_members: semesterMembers.filter(m => m.active_member).length,
        new_members: newMemberIds.length,
        new_active_members: newActiveMembers.length,
        members: semesterMembers.map(member => ({
          member_id: member?.Member?.member_id || null,
          membership_id: member?.membership_id || null,
          role_num: member?.membership_role || 0,
          firstName: member?.Member?.member_name?.split(' ')[0] || "",
          lastName: member?.Member?.member_name?.split(' ')[1] || "",
          rit_username: member?.Member?.member_email?.split('@')[0] || "",
          phone: member?.Member?.member_phone_number || "",
          points: member?.membership_points || 0
        }))
      },
      
      previous_semester: previousSemester ? {
        semester_name: previousSemester.semester_name,
        academic_year: previousSemester.academic_year,
        total_members: previousSemesterMembers.length,
        active_members: previousSemesterMembers.filter(m => m.active_member).length,
        new_members: 0, // Would need additional historical data to calculate accurately
        new_active_members: 0, // Would need additional historical data to calculate accurately
        general_meetings: previousSemesterEventCounts.generalMeetings,
        events: previousSemesterEventCounts.otherEvents,
        volunteering_events: previousSemesterEventCounts.volunteeringEvents,
        total_attendance: previousSemesterTotalAttendance
      } : null,
      
      event_data: {
        total_events: semesterEvents.length,
        general_meetings: semesterEventCounts.generalMeetings,
        events: semesterEventCounts.otherEvents,
        volunteering_events: semesterEventCounts.volunteeringEvents, 
        total_attendance: semesterTotalAttendance
      }
    };

    return { error: error.noError, data };
  } catch (err) {
    console.error("Error in getSemesterOrgReportBySemesterId:", err);
    return { error: error.databaseError, data: null };
  }
}

/**
 * Generate event report for organization
 */
async function getEventOrgReportInDB(orgId, eventId) {
  try {
    // Get organization info
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    // Get event info
    const event = await getEventById(eventId, orgId);
    if (!event) {
      return { error: error.eventNotFound, data: null };
    }

    // Get attendance and member info
    const attendances = await getEventAttendanceWithMembers(eventId);
    const membershipStatuses = await getMembershipsByAttributes({
        organization_id: orgId,
        member_id: attendances.map(a => a.Member.member_id),
    });

    // Format response data
    const data = {
      organization_id: organization.organization_id,
      organization_name: organization.organization_name,
      organization_abbreviation: organization.organization_abbreviation,
      event_id: event.event_id,
      event_type: event.event_type,
      event_date: event.event_start,
      event_name: event.event_name,
      event_location: event.event_location,
      event_description: event.event_description,
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
    console.error("Error in getEventOrgReportInDB:", err);
    return { error: error.databaseError, data: null };
  }
}

module.exports = {
  getSpecificReportOrgDataInDB,
  getAnnualOrgReportInDB,
  getAnnualOrgReportByYearInDB,
  getSemesterOrgReportInDB,
  getSemesterOrgReportBySemesterIdInDB,
  getEventOrgReportInDB
};