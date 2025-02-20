const { Organization } = require("../db");

/**
 * Create an Organization
 * @param {Object} organizationData - The data to create the organization record
 * @returns {Promise<Object>} The created organization record
 */
const createOrganization = async (organizationData) => {
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
const getOrganizationById = async (organizationId) => {
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
const getOrganizations = async () => {
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
const updateOrganizationByID = async (organizationId, updatedOrgInfo) => {
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
const updateOrganizationByName = async (organizationName, updatedOrgDesc) => {
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

module.exports = {
    createOrganization,
    getOrganizationById,
    getOrganizations,
    updateOrganizationByID,
    updateOrganizationByName
};