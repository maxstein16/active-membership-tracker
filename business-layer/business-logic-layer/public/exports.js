const {
  getSpecificMemberWithOrgData,
  addMemberToAnOrganization,
  editMemberInOrganization,
} = require("../organizationMemberProcessing");
const bcrypt = require("bcryptjs"); // or 'bcrypt' if you prefer

// export to api calls
module.exports = function () {
  // Member In Org Management

  this.getSpecificMemberOrgData = async (orgId, memberId) => {
    return await getSpecificMemberWithOrgData(orgId, memberId);
  };

  this.addMemberToOrg = async (orgId, memberData) => {
    // Hashing the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(memberData.password, saltRounds);
    memberData.password = hashedPassword; // Replacing the plain password with the newly hashed one
    // Passing the memberData with the hashed password to the Data Access Layer
    return await addMemberToAnOrganization(orgId, memberData);
  };

  this.editMemberInOrg = async (orgId, memberId, memberDataToUpdate) => {
    return await editMemberInOrganization(orgId, memberId, memberDataToUpdate);
  };

  this.deleteMemberInOrg = async (orgId, memberId) => {
    return await editMemberInOrganization(orgId, memberId);
  };

  // Member Calls (not org specific)

  // Organization Calls

  // Organization Settings Calls

  // Organization Reports Calls
};
