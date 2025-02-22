const { createAttendanceDB, getAttendanceByIdDB, getAttendanceByMemberAndEventDB, getMemberAttendanceStatsDB, getMemberAttendanceBySemesterDB } = require("../attendanceProcessing");
const { createEventInDB, updateEventInDB, getAllEventsByOrganizationInDB, getEventByIDInDB, getAttendanceByEventIdDB, getAllEventsByOrgAndSemesterDB } = require("../eventsProcessing");
const { createMemberInDB, updateMemberInDB, getMemberByIdInDB, getSpecificMemberOrgStatsInDB } = require("../memberProcessing");
const { getSpecificMemberWithOrgDataInDB, addMemberToAnOrganizationInDB, editMemberInOrganizationInDB, deleteMemberInOrganizationInDB, getMembersInOrganizationInDB } = require("../organizationMemberProcessing");
const { getMembershipRoleInfoInOrganizationInDB, getAllMembershipsInOrganizationInDB } = require("../organizationMembershipProcessing");
const { createOrganizationInDB, getSpecificOrgDataInDB, getAllOrganizationDataInDB, updateOrganizationInDB } = require("../organizationProcessing");
const { getSpecificReportOrgDataInDB, getAnnualOrgReportInDB, getSemesterOrgReportInDB, getMeetingOrgReportInDB } = require("../organizationReportProcessing");
const { editOrganizationMembershipRequirementsInDB, getOrganizationSettingsInDB, updateOrganizationEmailSettingsInDB, deleteOrganizationMembershipRequirementInDB, deleteOrganizationEmailSettingsInDB, createOrganizationEmailSettingsInDB } = require("../organizationSettingsProcessing");
  
  // export to api calls
  module.exports = function() {
    // Attendance Management
    this.createAttendance = async (attendanceData) => {
      return await createAttendanceDB(attendanceData);
    };
  
    this.getAttendanceById = async (attendanceId) => {
      return await getAttendanceByIdDB(attendanceId);
    };
  
    this.getMemberAttendanceStats = async (memberId) => {
      return await getMemberAttendanceStatsDB(memberId);
    };
  
    this.getAttendanceByMemberAndEvent = async (memberId, eventId) => {
      return await getAttendanceByMemberAndEventDB(memberId, eventId);
    };

    this.getMemberAttendanceBySemester = async (memberId, semesterId) => {
      return await getMemberAttendanceBySemesterDB(memberId, semesterId);
    }
  
    // Event Management
    this.createEvent = async (eventData) => {
      return await createEventInDB(eventData);
    };
  
    this.updateEvent = async (eventId, updateData) => {
      return await updateEventInDB(eventId, updateData);
    };
  
    this.getAllEventsByOrganization = async () => {
      return await getAllEventsByOrganizationInDB();
    };
  
    this.getEventById = async (eventId) => {
      return await getEventByIDInDB(eventId);
    };

    this.getAttendanceByEventId = async (eventId) => {
      return await getAttendanceByEventIdDB(eventId);
    };

    this.getAllEventsByOrgAndSemester = async (orgId, semesterId) => {
      return await getAllEventsByOrgAndSemesterDB(orgId, semesterId);
    }
  
    // Member Management
    this.createMember = async (memberData) => {
      return await createMemberInDB(memberData);
    };
  
    this.updateMember = async (memberId, memberData) => {
      return await updateMemberInDB(memberId, memberData);
    };
  
    this.getMemberById = async (memberId) => {
      return await getMemberByIdInDB(memberId);
    };
  
    this.getSpecificMemberOrgStats = async (filters) => {
      return await getSpecificMemberOrgStatsInDB(filters);
    };
  
    // Organization Member Management
    this.getSpecificMemberWithOrgData = async (orgId, memberData) => {
      return await getSpecificMemberWithOrgDataInDB(orgId, memberData);
    };

    this.addMemberToAnOrganization = async (orgId, memberData) => {
      return await addMemberToAnOrganizationInDB(orgId, memberData);
    }

    this.editMemberInOrganization = async (orgId, memberId, updatedRole) => {
      return await editMemberInOrganizationInDB(orgId, memberId, updatedRole);
    }

    this.deleteMemberInOrganization= async (orgId, memberId) => {
      return await deleteMemberInOrganizationInDB(orgId, memberId);
    }

    this.getMembersInOrganization = async (orgId) => {
      return await getMembersInOrganizationInDB(orgId);
    }

    // Organization Membership Management
    this.getMembershipRoleInfoInOrganization = async (organizationId, role, semesterId) => {
      return await getMembershipRoleInfoInOrganizationInDB(organizationId, role, semesterId);
    };

    this.getAllMembershipsInOrganization = async (organizationId, semesterId) => {
      return await getAllMembershipsInOrganizationInDB(organizationId, semesterId);
    }
  
    // Organization Management
    this.createOrganization = async (organizationData) => {
      return await createOrganizationInDB(organizationData);
    };
  
    this.getSpecificOrgData = async (organizationId) => {
      return await getSpecificOrgDataInDB(organizationId);
    };
  
    this.getAllOrganizationData = async () => {
      return await getAllOrganizationDataInDB();
    };
  
    this.updateOrganization = async (organizationId, updatedOrgInfo) => {
      return await updateOrganizationInDB(organizationId, updatedOrgInfo);
    };
  
    // Organization Report Management
    this.getSpecificReportOrgData = async (orgId, memberId) => {
      return await getSpecificReportOrgDataInDB(orgId, memberId);
    }

    this.getAnnualOrgReport = async (orgId) => {
      return await getAnnualOrgReportInDB(orgId);
    }

    this.getSemesterOrgReport = async (orgId) => {
      return await getSemesterOrgReportInDB(orgId);
    }

    this.getMeetingOrgReport = async (orgId) => {
      return await getMeetingOrgReportInDB(orgId);
    } 

    // Organization Settings Management
    this.getOrganizationSettings = async (orgId) => {
      return await getOrganizationSettingsInDB(orgId);
    }

    this.getOrganizationEmailSettings = async (orgId) => {
      return await getOrganizationEmailSettingsInDB(orgId);
    }

    this.createOrganizationEmailSettings = async (orgId, orgData) => {
      return await createOrganizationEmailSettingsInDB(orgId, orgData);
    }

    this.editOrganizationMembershipRequirement = async (orgId, orgData) => {
      return await editOrganizationMembershipRequirementsInDB(orgId, orgData);
    }

    this.editOrganizationEmailSettings = async (orgId, orgData) => {
      return await updateOrganizationEmailSettingsInDB(orgId, orgData);
    }

    this.deleteOrganizationMembershipRequirement = async (orgId, settingId) => {
      return await deleteOrganizationMembershipRequirementInDB(orgId, settingId);
    }

    this.deleteOrganizationEmailSettings = async (orgId) => {
      return await deleteOrganizationEmailSettingsInDB(orgId);
    }
  };