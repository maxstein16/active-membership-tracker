const { Membership } = require("../db");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieve membership role information for a specific organization
 * @param {number} organizationId - The ID of the organization
 * @param {number} role - The role ID to filter by
 * @returns {Promise<Object>} Membership details
 */
async function getMembershipRoleInfoInOrganization(organizationId, role) {
  try {
    if (isNaN(organizationId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(role)) {
      return { error: error.roleMustBeAnInteger, data: null };
    }

    const memberships = await Membership.findAll({
      where: { organization_id: organizationId, membership_role: role },
    });

    if (!memberships || memberships.length < 1) {
      return { error: error.membershipNotFound, data: null };
    }

    return { error: error.noError, data: memberships };
  } catch (err) {
    console.error("Error fetching membership role info:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Retrieve all members in a specific organization
 * @param {number} organizationId - The ID of the organization
 * @returns {Promise<Object>} List of members in the organization
 */
async function getAllMembershipsInOrganization(organizationId) {
  try {
    if (isNaN(organizationId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }

    const memberships = await Membership.findAll({
      where: { organization_id: organizationId },
    });

    if (!memberships) {
      return { error: error.membershipNotFound, data: null };
    }

    return { error: error.noError, data: memberships };
  } catch (err) {
    console.error("Error fetching members in organization:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

module.exports = {
  getMembershipRoleInfoInOrganization,
  getAllMembershipsInOrganization,
};
