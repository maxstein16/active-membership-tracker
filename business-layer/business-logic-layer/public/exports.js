const { getMemberById, updateMemberInDB, createMemberInDB } = require("../memberProcessing");
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
  this.getMember = async (memberId) => {
    return await getMemberById(memberId);
  }

  this.updateMember = async (memberId, memberData) => {
    return await updateMemberInDB(memberId, memberData);
  }

  this.createMember = async (memberData) => {
    return await createMemberInDB(memberData);
  }

  // Organization Calls

  // Organization Settings Calls
  
  // Organization Reports Calls
};
