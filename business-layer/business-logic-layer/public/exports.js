const { getSpecificMemberWithOrgData, addMemberToAnOrganization, editMemberInOrganization } = require("../organizationMemberProcessing");
const { getSpecificReportOrgData } = require("../organizationReportProcessing");

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

  // Member Calls (not org specific)

  // Organization Calls

  // Organization Settings Calls
  
  // Organization Reports Calls
  this.getAnnualOrgReport = async (orgId, meetingId) => {
    return await getSpecificReportOrgData(orgId, meetingId);
  }

  this.getMeetingOrgReport = async (orgId, meetingId) => {
    return await getSpecificReportOrgData(orgId, meetingId);
  }
};