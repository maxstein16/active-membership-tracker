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
  if (org_contact_email && (typeof org_contact_email !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(org_contact_email))) {
    return error.invalidOrgEmail;
  }

  // Validate phone number
  if (org_phone_number && (typeof org_phone_number !== 'string' || !/^\d{3}-\d{3}-\d{4}$/.test(org_phone_number))) {
    return error.invalidOrgPhoneNumber;
  }

  return null;
}

/**
 * Fetches organization data by ID.
 * @param {number} orgId - Organization ID.
 * @returns {Object} - Returns error and organization data.
 */
async function getSpecificOrgData(orgId) {
  if (!Number.isInteger(orgId)) {
    return { error: error.organizationIdMustBeInteger, data: null };
  }

  const orgData = await getOrganizationById(orgId);

  if (!orgData) {
    return { error: error.notFound, data: null };
  }

  return { error: error.noError, data: orgData };
}

/**
 * Adds a new organization.
 * @param {number} orgId - New organization's ID.
 * @param {Object} orgData - Organization data.
 * @returns {Object} - Returns error and new organization data.
 */
async function addOrganization(orgId, orgData) {
  const validationError = validateOrgFields(orgData);
  if (validationError) {
    return { error: error.validationError, data: null };
  }

  if (!Number.isInteger(orgId)) {
    return { error: error.organizationIdMustBeInteger, data: null };
  }

  try {
    const newOrganization = await createOrganization(orgId, orgData);
    if (!newOrganization) {
      return { error: error.addOrgFailed, data: null };
    }
    return { error: error.noError, data: newOrganization };
  } catch (err) {
    return { error: error.databaseError, data: null };
  }
}

/**
 * Edits an existing organization's details.
 * @param {number} orgId - Organization ID to update.
 * @param {Object} orgDataToUpdate - Fields to update.
 * @returns {Object} - Returns error and success message.
 */
async function editOrganization(orgId, orgDataToUpdate) {
  if (!Number.isInteger(orgId) || orgId <= 0) {
    return { error: error.invalidOrganizationId, data: null };
  }

  const validFields = Object.keys(orgDataToUpdate);
  if (validFields.length === 0) {
    return { error: error.mustHaveAtLeastOneFieldToEditOrg, data: null };
  }

  const validationError = validateOrgFields(orgDataToUpdate);
  if (validationError) {
    return { error: validationError, data: null };
  }

  const updateSuccess = await updateOrganizationByID(orgId, orgDataToUpdate);
  if (updateSuccess) {
    return { error: error.noError, data: { message: "Organization updated successfully." } };
  } else {
    return { error: error.orgNotFound, data: null };
  }
}

/**
 * Deletes an organization by ID.
 * @param {number} orgId - Organization ID to delete.
 * @returns {Object} - Returns error and deletion data.
 */
async function deleteOrganization(orgId) {
  if (!Number.isInteger(orgId) || orgId <= 0) {
    return { error: error.invalidOrganizationId, data: null };
  }

  try {
    const org = await Organization.getOrganizationById(orgId);
    if (!org) {
      return { error: error.orgNotFound, data: null };
    }

    await org.destroy();
    const deletionData = {
      message: 'Organization successfully deleted',
      org_id: orgId,
      removed_by: "admin@rit.edu",  // Adjust with real user data
      removed_at: new Date().toISOString(),
    };

    return { error: error.noError, data: deletionData };
  } catch (err) {
    return { error: error.databaseError, data: null };
  }
}

/**
 * Retrieves all organizations.
 * @returns {Object} - Returns error and formatted organization data.
 */
async function getAllOrganizationData() {
  try {
    const organizations = await getOrganizations(Organization);
    const formattedOrganizations = organizations.map(org => {
      const error = validateOrgFields({
        org_name: org.organization_name,
        org_description: org.organization_description,
        org_category: org.organization_category,
        org_contact_email: org.contact_email,
        org_phone_number: org.phone_number
      });

      if (error) {
        return { error: error, data: null };
      }

      return {
        org_id: org.id,
        org_name: org.organization_name,
        org_description: org.organization_description,
        org_category: org.organization_category,
        org_contact_email: org.contact_email,
        org_phone_number: org.phone_number,
        message: "Organization fetched successfully",
      };
    });

    return { error: error.noError, data: formattedOrganizations };
  } catch (err) {
    return { error: error.databaseError, data: null };
  }
}

module.exports = {
  getSpecificOrgData,
  addOrganization,
  editOrganization,
  deleteOrganization,
  getAllOrganizationData,
};
