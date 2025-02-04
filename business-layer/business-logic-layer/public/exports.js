const { getSpecificMemberWithOrgData, addMemberToAnOrganization, editMemberInOrganization } = require("../organizationMemberProcessing");

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

  // Organization Reports Calls
};
