const { getSpecificMemberWithOrgData, addMemberToAnOrganization, editMemberInOrganization, updateMemberAttendanceInOrganization, getMembersInOrganization, getMembershipRoleInfoInOrganization, updateMembershipRoleInfoInOrganization } = require("../organizationMemberProcessing");

// export to api calls
module.exports = function () {
  // Member In Org Management

  this.getSpecificMemberOrgData = async (orgId, memberId) => {
    return await getSpecificMemberWithOrgData(orgId, memberId);
  };

  this.addMemberToOrg = async (orgId, memberData) => {
    return await addMemberToAnOrganization(orgId, memberData);
  }

  this.editMemberInOrg = async (orgId, memberId, memberDataToUpdate) => {
    return await editMemberInOrganization(orgId, memberId, memberDataToUpdate);
  }

  this.deleteMemberInOrg = async (orgId, memberId) => {
    return await editMemberInOrganization(orgId, memberId);
  }

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

  // Organization Settings Calls
  
  // Organization Reports Calls
};
