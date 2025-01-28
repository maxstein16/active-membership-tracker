const { getSpecificMemberWithOrgData, addMemberToAnOrganization } = require("../organizationMemberProcessing");

// export to api calls
module.exports = function () {
  // Member In Org Management

  this.getSpecificMemberOrgData = async (orgId, memberId) => {
    return await getSpecificMemberWithOrgData(orgId, memberId);
  };

  this.addMemberToOrg = async (orgId, memberData) => {
    return await addMemberToAnOrganization(orgId, memberData);
  }

  // Member Calls (not org specific)

  // Organization Calls

  // Organization Settings Calls
  
  // Organization Reports Calls
};
