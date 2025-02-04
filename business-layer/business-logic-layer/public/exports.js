
const {
  getAllEventsByOrganization,
  getEventById,
  createEvent,
  updateEvent,
} = require ("../eventsProcessing")

const {
  getSpecificMemberWithOrgData, 
  addMemberToAnOrganization, 
  editMemberInOrganization, 
  updateMemberAttendanceInOrganization, 
  getMembersInOrganization, 
  getMembershipRoleInfoInOrganization, 
  updateMembershipRoleInfoInOrganization 
} = require("../organizationMemberProcessing");
const { getOrganizationSettings, editOrganizationMembershipRequirements, editOrganizationEmailSettings, deleteOrganizationMembershipRequirement } = require("../organizationSettingsProcessing");
const { getSpecificOrgData, getAllOrganizationData, addOrganization, editOrganization, deleteOrganization } = require("../organizationProcessing");
const hashPassword = require("./hash");

// export to api calls
module.exports = function () {
  // Member In Org Management

  this.getSpecificMemberOrgData = async (orgId, memberId) => {
    return await getSpecificMemberWithOrgData(orgId, memberId);
  };

  this.addMemberToOrg = async (orgId, memberData) => {
    memberData.password = await hashPassword(memberData.password);
    return await addMemberToAnOrganization(orgId, memberData);
  };

  this.editMemberInOrg = async (orgId, memberId, memberDataToUpdate) => {
    return await editMemberInOrganization(orgId, memberId, memberDataToUpdate);
  };

  this.deleteMemberInOrg = async (orgId, memberId) => {
    return await editMemberInOrganization(orgId, memberId);
  };

  // Member Calls (not org specific)
  this.getMember = async (memberId) => {
    return await getMemberById(memberId);
  }

  this.updateMember = async (memberId, memberData) => {
    return await updateMemberInDB(memberId, memberData);
  }

  this.createMember = async (memberData) => {
    return await createMemberInDB(memberData);
  }
  this.getSpecificMemberOrgStats = async (memberId, orgId) => {
    return await getSpecificMemberOrgStats(memberId, orgId);
  };

  // Organization Calls

  this.getSpecificOrgData = async (orgId) => {
    return await getSpecificOrgData(orgId);
  };

  this.getAllOrganizationData = async () => {
    return await getAllOrganizationData(orgId);

  };

  this.addOrganization = async (organizationData) => {
    return await addOrganization(organizationData);

  };

  this.editOrganization = async (orgId, orgDataToUpdate) => {
    return await editOrganization(orgId, orgDataToUpdate);

  };

  this.deleteOrganization = async (orgId) => {
    return await deleteOrganization(orgId);

  };

  // Organization Settings Calls

  this.getOrganizationSettings = async (orgId) => {
    return await getOrganizationSettings(orgId);
  };

  this.editOrganizationMembershipRequirements = async (orgId, settingDataToUpdate) => {
    return await editOrganizationMembershipRequirements(orgId, settingDataToUpdate);
  }

  this.editOrganizationEmailSettings = async (orgId, emailDataToUpdate) => {
    return await editOrganizationEmailSettings(orgId, emailDataToUpdate);
  }

  this.deleteOrganizationMembershipRequirement = async (orgId, membershipId) => {
    return await deleteOrganizationMembershipRequirement(orgId, membershipId);
  }

  // Organization Reports Calls
  this.getAnnualOrgReport = async (orgId, meetingId) => {
    return await getSpecificReportOrgData(orgId, meetingId);
  }

  this.getMeetingOrgReport = async (orgId, meetingId) => {
    return await getSpecificReportOrgData(orgId, meetingId);
  }
  
  // Organization Reports Calls

  // Event Management
  this.getAllEventsByOrganization = async (orgId) => {
    return await getAllEventsByOrganization(orgId);
  };

  this.getEventById = async (orgId, eventId) => {
    return await getEventById(orgId, eventId);
  };

  this.createEvent = async (orgId, eventData) => {
    return await createEvent(orgId, eventData);
  };

  this.updateEvent = async (orgId, eventId, updateData) => {
    return await updateEvent(orgId, eventId, updateData);
  };

};

