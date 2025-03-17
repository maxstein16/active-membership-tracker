const {
  Organization,
  MembershipRequirement,
  BonusRequirement,
  Membership,
  Member,
} = require("../db");

/**
 * Create an Organization
 * @param {Object} organizationData - The data to create the organization record
 * @returns {Promise<Object>} The created organization record
 */
async function createOrganization(organizationData) {
  try {
    const organization = await Organization.create(organizationData);
    return organization;
  } catch (err) {
    console.error("Error creating organization:", err);
    throw err;
  }
}

/**
 * Get an Organization by its ID
 * @param {number} organizationId - The ID of the organization record
 * @returns {Promise<Object|null>} The organization record, or null if not found
 */
async function getOrganizationById(organizationId) {
  try {
    const organization = await Organization.findByPk(organizationId);
    return organization;
  } catch (err) {
    console.error("Error fetching organization by ID:", err);
    throw err;
  }
}

/**
 * Get all Organizations
 * @returns {Promise<Array>} List of organization records
 */
async function getOrganizations() {
  try {
    const organizations = await Organization.findAll();
    return organizations;
  } catch (err) {
    console.error("Error fetching organizations:", err);
    throw err;
  }
}

/**
 * Update an existing Organization by its ID
 * @param {number} organizationId - The ID of the organization
 * @param {object} updatedOrgInfo - The information about the organization to update
 * @returns {Promise<boolean>} Returns true if the organization was updated,
 *    false if no organization with the provided ID exists
 */
async function updateOrganizationByID(organizationId, updatedOrgInfo) {
    
  try {
    const [updatedOrgRows] = await Organization.update(updatedOrgInfo, {
      where: { organization_id: organizationId }, 
            logging: true,
    });

    if (updatedOrgRows > 0) {
      console.log(
        `Organization with ID ${organizationId} updated successfully.`
      );
      return true;
    } else {
      console.log(`No organization found with ID ${organizationId}`);
      return false;
    }
  } catch (err) {
    console.error("Error updating organization:", err);
    throw err;
  }
}

/**
 * Update an existing Organization's description by its Name
 * @param {number} organizationName - The name of the organization
 * @param {object} updatedOrgDesc - The information about the organization to update
 * @returns {Promise<boolean>} Returns true if the organization was updated,
 *    false if no organization with the provided name exists
 */
async function updateOrganizationByName(organizationName, updatedOrgDesc) {
  try {
    const [updatedOrgRows] = await Organization.update(updatedOrgDesc, {
      where: { organization_name: organizationName },
    });

    if (updatedOrgRows > 0) {
      console.log(
        `Organization with name ${organizationName} updated successfully.`
      );
      return true;
    } else {
      console.log(`No organization found with name ${organizationName}`);
      return false;
    }
  } catch (err) {
    console.error("Error updating organization:", err);
    throw err;
  }
}

/**
 * Get organization membership requirements, including bonus requirements
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Array>} Membership requirements with bonuses
 */
async function getOrganizationMembershipRequirements(orgId) {
  try {
    const membershipRequirements = await MembershipRequirement.findAll({
      where: { organization_id: orgId },
      include: [
        {
          model: BonusRequirement,
          required: false, // Include bonus requirements if they exist
        },
      ],
    });

    return membershipRequirements;
  } catch (err) {
    console.error("Error fetching membership requirements:", err);
    throw err;
  }
}

/**
 * Create a new membership requirement for an organization
 * @param {Object} requirementData - The requirement data including organization_id, meeting_type, frequency, amount_type, amount, and requirement_scope
 * @returns {Promise<Object>} The created requirement record
 */
async function createOrganizationMembershipRequirement(requirementData) {
  try {
    const requirement = await MembershipRequirement.create(requirementData);
    console.log(
      `Created requirement for organization ID ${requirementData.organization_id}`
    );
    return requirement;
  } catch (err) {
    console.error("Error creating organization requirement:", err);
    throw err;
  }
}

/**
 * Edit an organization's membership requirement
 * @param {number} requirementId - The ID of the requirement to edit
 * @param {Object} requirementData - The updated requirement data
 * @returns {Promise<boolean>} Returns true if requirement was updated, false if not found
 */
async function editOrganizationMembershipRequirement(
  requirementId,
  requirementData
) {
  try {
    const [updatedRows] = await MembershipRequirement.update(requirementData, {
      where: { requirement_id: requirementId },
    });

    if (updatedRows > 0) {
      console.log(`Requirement updated with ID ${requirementId}`);
      return true;
    } else {
      console.log(`No requirement found with ID ${requirementId}`);
      return false;
    }
  } catch (err) {
    console.error("Error updating organization requirement:", err);
    throw err;
  }
}

/**
 * Get all bonus requirements for a specific membership requirement
 * @param {number} requirementId - The ID of the membership requirement
 * @returns {Promise<Array>} List of bonus requirement records
 */
async function getBonusRequirements(requirementId) {
  try {
    const bonusRequirements = await BonusRequirement.findAll({
      where: { requirement_id: requirementId },
    });

    return bonusRequirements;
  } catch (err) {
    console.error("Error fetching bonus requirements by requirement ID:", err);
    throw err;
  }
}

/**
 * Create a bonus requirement for a membership requirement
 * @param {number} requirementId - The ID of the membership requirement
 * @param {object} bonusData - Bonus threshold and points
 * @returns {Promise<Object>} Created bonus requirement
 */
async function createBonusRequirement(requirementId, bonusData) {
  try {
    const bonusRequirement = await BonusRequirement.create({
      requirement_id: requirementId,
      ...bonusData,
    });

    return bonusRequirement;
  } catch (err) {
    console.error("Error creating bonus requirement:", err);
    throw err;
  }
}

/**
 * Edit a bonus requirement
 * @param {number} bonusId - The ID of the bonus requirement
 * @param {object} updateData - Updated bonus requirement data
 * @returns {Promise<Object>} Updated bonus requirement
 */
async function editBonusRequirement(bonusId, updateData) {
  try {
    const bonusRequirement = await BonusRequirement.findByPk(bonusId);

    if (!bonusRequirement) {
      return null;
    }

    await bonusRequirement.update(updateData);
    return bonusRequirement;
  } catch (err) {
    console.error("Error updating bonus requirement:", err);
    throw err;
  }
}

/**
 * Delete a bonus requirement
 * @param {number} bonusId - The ID of the bonus requirement
 * @returns {Promise<boolean>} Deletion success status
 */
async function deleteBonusRequirement(bonusId) {
  try {
    const deleted = await BonusRequirement.destroy({
      where: { bonus_id: bonusId },
    });

    return deleted > 0;
  } catch (err) {
    console.error("Error deleting bonus requirement:", err);
    throw err;
  }
}

/**
 * Get organizations that a user is a member of
 * @param {string} username - The username (email) of the user
 * @returns {Promise<Array>} List of organization records
 */
async function getUserOrganizations(username) {
  try {
    // Find the member by their email (username)
    const member = await Member.findOne({
      where: { member_email: username },
    });

    if (!member) {
      console.log(`No member found with email ${username}`);
      return [];
    }

    console.log(`Found member with ID: ${member.member_id}`);

    // Find all memberships for this member along with their organizations
    const memberships = await Membership.findAll({
      where: { member_id: member.member_id },
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: [
            "organization_id",
            "organization_name",
            "organization_description",
            "organization_color",
            "organization_abbreviation",
            "organization_email",
            "organization_membership_type",
            "organization_threshold",
          ],
        },
      ],
    });

    // Extract the organizations from the memberships
    const organizations = memberships
      .filter((membership) => membership.organization !== null)
      .map((membership) => membership.organization);

    return organizations;
  } catch (err) {
    console.error("Error fetching user organizations:", err);
    throw err;
  }
}

module.exports = {
  createOrganization,
  getOrganizationById,
  getOrganizations,
  updateOrganizationByID,
  updateOrganizationByName,
  getOrganizationMembershipRequirements,
  createOrganizationMembershipRequirement,
  editOrganizationMembershipRequirement,
  getBonusRequirements,
  createBonusRequirement,
  editBonusRequirement,
  deleteBonusRequirement,
  getUserOrganizations,
};
