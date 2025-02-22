const { Organization, MembershipRequirement } = require("../db");

/**
 * Create an Organization
 * @param {Object} organizationData - The data to create the organization record
 * @returns {Promise<Object>} The created organization record
 */
async function createOrganization (organizationData) {
    try {
        const organization = await Organization.create(organizationData);
        return organization;
    } catch (err) {
        console.error("Error creating organization:", err);
        throw err;
    }
};

/**
 * Get an Organization by its ID
 * @param {number} organizationId - The ID of the organization record
 * @returns {Promise<Object|null>} The organization record, or null if not found
 */
async function getOrganizationById (organizationId) {
    try {
        const organization = await Organization.findByPk(organizationId);
        return organization;
    } catch (err) {
        console.error("Error fetching organization by ID:", err);
        throw err;
    }
};

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
};

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
            where: { organization_id: organizationId }
        });

        if (updatedOrgRows > 0) {
            console.log(`Organization with ID ${organizationId} updated successfully.`);
            return true;
        } else {
            console.log(`No organization found with ID ${organizationId}`);
            return false;
        }
    } catch (err) {
        console.error("Error updating organization:", err);
        throw err;
    }
};

/**
 * Update an existing Organization's description by its Name
 * @param {number} organizationName - The name of the organization
 * @param {object} updatedOrgDesc - The information about the organization to update
 * @returns {Promise<boolean>} Returns true if the organization was updated, 
 *    false if no organization with the provided name exists
 */
async function updateOrganizationByName (organizationName, updatedOrgDesc) {
    try {
        const [updatedOrgRows] = await Organization.update(updatedOrgDesc, {
            where: { organization_name: organizationName }
        });

        if (updatedOrgRows > 0) {
            console.log(`Organization with name ${organizationName} updated successfully.`);
            return true;
        } else {
            console.log(`No organization found with name ${organizationName}`);
            return false;
        }
    } catch (err) {
        console.error("Error updating organization:", err);
        throw err;
    }
};

/**
 * Get an Organization's membership requirements
 * @param {number} organizationId - The ID of the organization
 * @returns {Promise<Array>} List of membership requirements for the organization
 */
async function getOrganizationMembershipRequirements(organizationId) {
    try {
        const requirements = await MembershipRequirement.findAll({
            where: { organization_id: organizationId }
        });
        
        if (!requirements || requirements.length === 0) {
            console.log(`No requirements found for organization ID ${organizationId}`);
            return [];
        }

        console.log(`Retrieved requirements for organization ID ${organizationId}`);
        return requirements;
    } catch (err) {
        console.error("Error fetching organization requirements:", err);
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
        console.log(`Created requirement for organization ID ${requirementData.organization_id}`);
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
async function editOrganizationMembershipRequirement(requirementId, requirementData) {
    try {
        const [updatedRows] = await MembershipRequirement.update(requirementData, {
            where: { requirement_id: requirementId }
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


module.exports = {
    createOrganization,
    getOrganizationById,
    getOrganizations,
    updateOrganizationByID,
    updateOrganizationByName,
    getOrganizationMembershipRequirements,
    createOrganizationMembershipRequirement,
    editOrganizationMembershipRequirement
};