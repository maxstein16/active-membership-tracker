const {
  getSpecificMemberWithOrgData,
  addMemberToAnOrganization,
  editMemberInOrganization,
} = require("../organizationMemberProcessing");
const {
  getAllEventsByOrganization,
  getEventById,
  createEvent,
  updateEvent,
} = require ("../eventsProcessing")
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

  // Organization Calls

  // Organization Settings Calls

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
