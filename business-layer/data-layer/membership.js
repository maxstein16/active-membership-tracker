const { Membership, Member, MembershipRequirement } = require("../db");

/**
 * Create a membership record
 * @param {Object} membershipData - The data to create the membership record
 * @returns {Promise<Object>} The created membership record
 */
const createMembership = async (membershipData) => {
  try {
    const membership = await Membership.create(membershipData);
    console.log("membership successfully created")
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

/**
 * Retrieves memberships based on provided filters
 * @param {Object} filters - Attributes to filter by (e.g., organization_id, semester_id, membership_role)
 * @returns {Promise<Object[]>} An array of matching membership objects (empty if no matches found)
 */
const getMembershipsByAttributes = async (filters) => {

  try {
    const memberships = await Membership.findAll({
      where: filters
    });

    return memberships;
  } catch (err) {
    console.error("Error fetching memberships by attributes:", err);
    throw err;
  }
};

/**
 * Get a single membership by its attributes
 * @param {Object} filters - Attributes to filter by (e.g., organization_id, member_id, semester_id)
 * @returns {Promise<Object|null>} The membership object if found, otherwise null
 */
const getMembershipByAttributes = async (filters) => {

  try {
    const membership = await Membership.findOne({
      where: filters
    });

    if (!membership) {
      console.log("No membership found matching the given criteria.");
      return null;
    }

    // console.log("Membership found:", membership.toJSON());
    return membership;
  } catch (err) {
    console.error("Error fetching membership by attributes:", err);
    throw err;
  }
};

async function getMembershipsByOrgAndSemester(orgId, semesterIds) {
  try {
    const memberships = await Membership.findAll({
      where: {
        organization_id: orgId,
        semester_id: semesterIds
      },
      include: [{
        model: Member,
        required: true
      }]
    });

    return memberships;
  } catch (err) {
    console.error("Error in getMembershipsByOrgAndSemester:", err);
    throw err;
  }
}

async function deleteMembershipRequirement(requirementId) {
  try {
    const results = await MembershipRequirement.destroy({
      where: {
        requirement_id: requirementId
      }
    });

    return results;
  } catch (err) {
    console.error("Error in getMembershipsByOrgAndSemester:", err);
    throw err;
  }
}

module.exports = {
  createMembership,
  editMembership,
  editMembershipRole,
  getMembershipsByAttributes,
  getMembershipByAttributes,
  getMembershipsByOrgAndSemester,
  deleteMembershipRequirement
};