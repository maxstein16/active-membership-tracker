const {
  getSpecificMemberWithOrgData,
  addMemberToAnOrganization,
  editMemberInOrganization,
  updateMemberAttendanceInOrganization, 
  getMembersInOrganization, 
  getMembershipRoleInfoInOrganization, 
  updateMembershipRoleInfoInOrganization
} = require("../organizationMemberProcessing");
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

  this.getMembershipRoleInOrg = async (roleId) => {
    return await getMembershipRoleInfoInOrganization(roleId);
  }

  this.editMembershipRoleInOrg = async (memberId) => {
    return await updateMembershipRoleInfoInOrganization(memberId);
  }

  this.getMembersInOrg = async (orgId) => {
    return await getMembersInOrganization(orgId);
  }

  this.updateMemberAttendanceInOrg = async (orgId, memberId, attendanceData) => {
    return await updateMemberAttendanceInOrganization(orgId, memberId, attendanceData);
  }

  // Member Calls (not org specific)

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

  // Organization Reports Calls
  this.getAnnualOrgReport = async (orgId, meetingId) => {
    return await getSpecificReportOrgData(orgId, meetingId);
  }

  this.getMeetingOrgReport = async (orgId, meetingId) => {
    return await getSpecificReportOrgData(orgId, meetingId);
  }
};