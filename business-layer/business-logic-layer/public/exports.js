const { getSpecificMemberWithOrgData, addMemberToAnOrganization, editMemberInOrganization } = require("../organizationMemberProcessing");

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

  getSpecificOrganizationData = async (orgId) => {

  };

  getAllOrganizationData = async => {

  };

  addOrganization = async (organizationData) => {

  };

  editOrganization = async (orgId, orgDataToUpdate) => {

  };

  deleteOrganization = async (orgId) => {

  };

  // Organization Settings Calls
  
  // Organization Reports Calls
};
