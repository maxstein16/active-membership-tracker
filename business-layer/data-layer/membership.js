import { Membership } from "../db";

/**
 * Create a membership record
 * @param {Object} membershipData - The data to create the membership record
 * @returns {Promise<Object>} The created membership record
 */
const createMembership = async (membershipData) => {
  try {
    const membership = await Membership.create(membershipData);
    return membership;
  } catch (err) {
    console.error("Error creating membership:", err);
    throw err;
  }
};

/**
 * Edit an existing membership record
 * @param {number} membershipId - The ID of the membership record
 * @param {Object} updates - The data to update in the membership record
 * @returns {Promise<Object|null>} The updated membership record, or null if not found
 */
const editMembership = async (membershipId, updates) => {
  try {
    const membership = await Membership.findByPk(membershipId);
    if (!membership) {
      console.error("Membership not found with ID:", membershipId);
      return null;
    }
    const updatedMembership = await membership.update(updates);
    return updatedMembership;
  } catch (err) {
    console.error("Error updating membership:", err);
    throw err;
  }
};

/**
 * Edit the role of an existing membership record
 * @param {number} membershipId - The ID of the membership record
 * @param {number} newRole - The new role to assign to the membership
 * @returns {Promise<Object|null>} The updated membership record, or null if not found
 */
const editMembershipRole = async (membershipId, newRole) => {
  try {
    const membership = await Membership.findByPk(membershipId);
    if (!membership) {
      console.error("Membership not found with ID:", membershipId);
      return null;
    }
    membership.membership_role = newRole;
    const updatedMembership = await membership.save();
    return updatedMembership;
  } catch (err) {
    console.error("Error updating membership role:", err);
    throw err;
  }
};

export { createMembership, editMembership, editMembershipRole };