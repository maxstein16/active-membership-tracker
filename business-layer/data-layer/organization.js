import { Organization } from "../db";

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
   * @param {number} organizationId - The ID of the organization
   * @returns {Promise<Array>} List of organization records
   */
  const getOrganizations = async (Organization) => {
    try {
      const organizations = await Organization.findAll();
      return organizations;
    } catch (err) {
      console.error("Error fetching organizations:", err);
      throw err;
    }
  };

module.exports = {
    createOrganization,
    getOrganizationById,
    getOrganizations
}