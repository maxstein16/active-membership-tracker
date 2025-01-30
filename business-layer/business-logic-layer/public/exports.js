const {
  getSpecificMemberWithOrgData,
  addMemberToAnOrganization,
  editMemberInOrganization,
} = require("../organizationMemberProcessing");

const {
  getSpecificMemberData,
  addMember,
  editMember,
  deleteMember,
} = require("../memberProcessing"); // processing for members (no org specific)

// export to api calls
module.exports = function () {
  // Member In Org Management

  this.getSpecificMemberOrgData = async (orgId, memberId) => {
    return await getSpecificMemberWithOrgData(orgId, memberId);
  };

  this.addMemberToOrg = async (orgId, memberData) => {
    return await addMemberToAnOrganization(orgId, memberData);
  };

  this.editMemberInOrg = async (orgId, memberId, memberDataToUpdate) => {
    return await editMemberInOrganization(orgId, memberId, memberDataToUpdate);
  };

  this.deleteMemberInOrg = async (orgId, memberId) => {
    return await editMemberInOrganization(orgId, memberId);
  };

  // Member Calls (not org specific)
  this.getSpecificMemberData = async (memberId) => {
    return await getSpecificMemberData(memberId);
  };

  this.addMember = async (memberData) => {
    return await addMember(memberData);
  };

  this.editMember = async (memberId, memberDataToUpdate) => {
    return await editMember(memberId, memberDataToUpdate);
  };

  // Not yet...
  this.deleteMember = async (orgId, memberId) => {
    return await deleteMember(orgId, memberId);
  };

  // Organization Calls

  // Organization Settings Calls

  // Organization Reports Calls
};
