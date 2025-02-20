const { createOrganization, getOrganizationById, getOrganizations, updateOrganizationByID, updateOrganizationByName } = require("../data-layer/organization.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
* Validates the fields of an organization.
* @param {Object} fields - The organization data to validate.
* @returns {Object|null} - Error object if invalid, null if valid.
*/
function validateOrgFields(fields) {
  if (!fields || typeof fields !== 'object') {
      return error.invalidData;
  }

  const { org_name, org_description, org_category, org_contact_email, org_phone_number } = fields;

  // Validate organization name
  if (org_name && (typeof org_name !== 'string' || org_name.trim() === '')) {
      return error.invalidOrgName;
  }

  // Validate organization description
  if (org_description && (typeof org_description !== 'string' || org_description.trim() === '')) {
      return error.invalidOrgDescription;
  }

  // Validate organization category
  if (org_category && (typeof org_category !== 'string' || org_category.trim() === '')) {
      return error.invalidOrgCategory;
  }

  // Validate contact email
  if (org_contact_email && (typeof org_contact_email !== 'string' || 
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(org_contact_email))) {
      return error.invalidOrgEmail;
  }

  // Validate phone number
  if (org_phone_number && (typeof org_phone_number !== 'string' || 
      !/^\d{3}-\d{3}-\d{4}$/.test(org_phone_number))) {
      return error.invalidOrgPhoneNumber;
  }

  return null;
}

/**
* Fetches organization data by ID.
* @param {number} orgId - Organization ID.
* @returns {Promise<Object>} - Returns error and organization data.
*/
async function getSpecificOrgData(orgId) {
  if (!Number.isInteger(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
  }

  try {
      const orgData = await getOrganizationById(orgId);
      if (!orgData) {
          return { error: error.notFound, data: null };
      }

      return { error: null, data: orgData };
  } catch (err) {
      console.error("Error in getSpecificOrgData:", err);
      return { error: error.databaseError, data: null };
  }
}

/**
* Adds a new organization.
* @param {Object} orgData - Organization data.
* @returns {Promise<Object>} - Returns error and new organization data.
*/
async function addOrganization(orgData) {
  const validationError = validateOrgFields(orgData);
  if (validationError) {
      return { error: validationError, data: null };
  }

  try {
      const mappedData = {
          organization_name: orgData.org_name,
          organization_description: orgData.org_description,
          organization_category: orgData.org_category,
          contact_email: orgData.org_contact_email,
          phone_number: orgData.org_phone_number
      };

      const newOrganization = await createOrganization(mappedData);
      return { error: null, data: newOrganization };
  } catch (err) {
      console.error("Error in addOrganization:", err);
      return { error: error.databaseError, data: null };
  }
}

/**
* Edits an existing organization's details.
* @param {number} orgId - Organization ID to update.
* @param {Object} orgDataToUpdate - Fields to update.
* @returns {Promise<Object>} - Returns error and success message.
*/
async function editOrganization(orgId, orgDataToUpdate) {
  if (!Number.isInteger(orgId) || orgId <= 0) {
      return { error: error.invalidOrganizationId, data: null };
  }

  if (Object.keys(orgDataToUpdate).length === 0) {
      return { error: error.mustHaveAtLeastOneFieldToEditOrg, data: null };
  }

  const validationError = validateOrgFields(orgDataToUpdate);
  if (validationError) {
      return { error: validationError, data: null };
  }

  try {
      const mappedData = {
          organization_name: orgDataToUpdate.org_name,
          organization_description: orgDataToUpdate.org_description,
          organization_category: orgDataToUpdate.org_category,
          contact_email: orgDataToUpdate.org_contact_email,
          phone_number: orgDataToUpdate.org_phone_number
      };

      // Remove undefined fields
      Object.keys(mappedData).forEach(key => 
          mappedData[key] === undefined && delete mappedData[key]
      );

      const updateSuccess = await updateOrganizationByID(orgId, mappedData);
      if (updateSuccess) {
          return { 
              error: null, 
              data: { message: "Organization updated successfully." }
          };
      } else {
          return { error: error.orgNotFound, data: null };
      }
  } catch (err) {
      console.error("Error in editOrganization:", err);
      return { error: error.databaseError, data: null };
  }
}

/**
* Retrieves all organizations.
* @returns {Promise<Object>} - Returns error and formatted organization data.
*/
async function getAllOrganizationData() {
  try {
      const organizations = await getOrganizations();
      
      const formattedOrganizations = organizations.map(org => ({
          org_id: org.organization_id,
          org_name: org.organization_name,
          org_description: org.organization_description,
          org_category: org.organization_category,
          org_contact_email: org.contact_email,
          org_phone_number: org.phone_number,
          message: "Organization fetched successfully"
      }));

      return { error: null, data: formattedOrganizations };
  } catch (err) {
      console.error("Error in getAllOrganizationData:", err);
      return { error: error.databaseError, data: null };
  }
}

module.exports = {
  getSpecificOrgData,
  addOrganization,
  editOrganization,
  getAllOrganizationData,
};