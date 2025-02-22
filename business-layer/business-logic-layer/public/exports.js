const { createAttendanceDB, getAttendanceByIdDB, getAttendanceByMemberIdDB, getAttendanceByMemberAndEventDB } = require("../attendanceProcessing");
const { createEventInDB, updateEventInDB, getAllEventsByOrganizationInDB, getEventByIDInDB, getAttendanceByEventIdDB } = require("../eventsProcessing");
const { createMemberInDB, updateMemberInDB, getMemberByIdInDB, getSpecificMemberOrgStatsInDB } = require("../memberProcessing");
const { getSpecificMemberWithOrgDataInDB, addMemberToAnOrganizationInDB, editMemberInOrganizationInDB, deleteMemberInOrganizationInDB, getMembersInOrganizationInDB } = require("../organizationMemberProcessing");
const { getMembershipRoleInfoInOrganizationInDB, getAllMembershipsInOrganizationInDB } = require("../organizationMembershipProcessing");
const { createOrganizationInDB, getSpecificOrgDataInDB, getAllOrganizationDataInDB, updateOrganizationInDB } = require("../organizationProcessing");
const { getAllOrgRecognitionsFromDB, getSpecificRecognitionFromDB, updateSpecificRecognitionInDB } = require("../organizationRecognitionProcessing");
const { getSpecificReportOrgDataInDB, getAnnualOrgReportInDB, getSemesterOrgReportInDB, getMeetingOrgReportInDB } = require("../organizationReportProcessing");
const { getOrganizationSettingsInDB, editOrganizationMembershipRequirementsInDB, editOrganizationEmailSettingsInDB, deleteOrganizationMembershipRequirementInDB } = require("../organizationSettingsProcessing");
  
  // export to api calls
  module.exports = function() {
    // Attendance Management
    this.createAttendance = async (attendanceData) => {
      return await createAttendanceDB(attendanceData);
    };
  
    this.getAttendanceById = async (attendanceId) => {
      return await getAttendanceByIdDB(attendanceId);
    };
  
    this.getAttendanceByMemberId = async (memberId) => {
      return await getAttendanceByMemberIdDB(memberId);
    };
  
    this.getAttendanceByMemberAndEvent = async (memberId, eventId) => {
      return await getAttendanceByMemberAndEventDB(memberId, eventId);
    };
  
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

    this.editOrganizationMembershipRequirement = async (orgId, orgData) => {
      return await editOrganizationMembershipRequirementsInDB(orgId, orgData);
    }

    this.editOrganizationEmailSettings = async (orgId, orgData) => {
      return await editOrganizationEmailSettingsInDB(orgId, orgData);
    }

    this.deleteOrganizationMembershipRequirement = async (orgId, settingId) => {
      return await deleteOrganizationMembershipRequirementInDB(orgId, settingId);
    }
  };