const { createEmailSettings } = require("../data-layer/email-settings.js");
const {
  getOrganizationById,
  createOrganization,
  updateOrganizationByID,
  getOrganizations,
} = require("../data-layer/organization.js");
const { getOrganizationById, createOrganization, updateOrganizationByID, getOrganizations, getUserOrganizations } = require("../data-layer/organization.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Validates the fields of an organization.
 * @param {Object} fields - The organization data to validate.
 * @returns {Object|null} - Error object if invalid, null if valid.
 */
function validateOrgFields(fields) {
  if (!fields || typeof fields !== "object") {
    return error.invalidData;
  }

  const {
    organization_name,
    organization_desc,
    organization_abbreviation,
    organization_color,
    active_membership_threshold,
  } = fields;

  // Validate organization name
  if (organization_name && (typeof organization_name !== "string" || organization_name.trim() === "")) {
    return error.invalidOrgName;
  }

  // Validate organization description
  if (
    organization_desc &&
    (typeof organization_desc !== "string" || organization_desc.trim() === "")
  ) {
    return error.invalidOrgDescription;
  }

  // abbreviation
  if (
    organization_abbreviation &&
    (typeof organization_abbreviation !== "string" || organization_abbreviation.trim() === "")
  ) {
    return error.invalidOrgAbbreviation;
  }

  // color
  if (
    organization_color &&
    (typeof organization_color !== "string" || organization_color.trim() === ""  || organization_color.charAt(0) !== '#' || organization_color.length !== 7)
  ) {
    return error.invalidOrgAbbreviation;
  }

  console.log()

  // threshold
  if (active_membership_threshold
     &&
    (typeof active_membership_threshold !== "number")
  ) {
    return error.invalidOrgThreshold;
  }


  return null;
}

/**
 * Maps API fields to database fields
 * @param {Object} orgData - Organization data with API field names
 * @returns {Object} Organization data with database field names
 */
function mapToDbFields(orgData) {
  return {
    organization_name: orgData.org_name,
    organization_description: orgData.org_description,
    organization_category: orgData.org_category,
    contact_email: orgData.org_contact_email,
    phone_number: orgData.org_phone_number,
  };
}

/**
 * Maps database fields to API fields
 * @param {Object} dbData - Organization data with database field names
 * @returns {Object} Organization data with API field names
 */
function mapToApiFields(dbData) {
  return {
    org_id: dbData.organization_id,
    org_name: dbData.organization_name,
    org_description: dbData.organization_description,
    org_category: dbData.organization_category,
    org_contact_email: dbData.contact_email,
    org_phone_number: dbData.phone_number,
    message: "Organization fetched successfully",
  };
}

/**
 * Fetches organization data by ID.
 * @param {number} orgId - Organization ID.
 * @returns {Promise<Object>} - Returns error and organization data.
 */
async function getSpecificOrgDataInDB(orgId) {
  if (!Number.isInteger(orgId)) {
    return { error: error.organizationIdMustBeInteger, data: null };
  }

  try {
    const orgData = await getOrganizationById(orgId);
    if (!orgData) {
      return { error: error.notFound, data: null };
    }

    return { error: null, data: mapToApiFields(orgData) };
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
async function createOrganizationInDB(orgData) {
  const validationError = validateOrgFields(orgData);
  if (validationError) {
    return { error: validationError, data: null };
  }

  try {
    console.log(orgData)
    const newOrganization = await createOrganization({
      organization_name: orgData.organization_name,
      organization_description: orgData.organization_desc,
      organization_color: orgData.organization_color,
      organization_abbreviation: orgData.organization_abbreviation,
      organization_threshold: orgData.active_membership_threshold,
    });
    
    // create email settings for the org
    const newEmailSettings = await createEmailSettings(newOrganization.organization_id, {
      current_status: true,
      annual_report: true,
      semester_report: true,
      membership_achieved: true
    });

    return { error: null, data: {...newOrganization.dataValues, email_setting_id: newEmailSettings.email_setting_id }};
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
async function updateOrganizationInDB(orgId, orgDataToUpdate) {
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
    const mappedData = mapToDbFields(orgDataToUpdate);

    // Remove undefined fields
    Object.keys(mappedData).forEach(
      (key) => mappedData[key] === undefined && delete mappedData[key]
    );

    const updateSuccess = await updateOrganizationByID(orgId, mappedData);
    if (updateSuccess) {
      return {
        error: null,
        data: { message: "Organization updated successfully." },
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
async function getAllOrganizationDataInDB() {
  try {
    const organizations = await getOrganizations();
    const formattedOrganizations = organizations.map(mapToApiFields);
    return { error: null, data: formattedOrganizations };
  } catch (err) {
    console.error("Error in getAllOrganizationData:", err);
    return { error: error.databaseError, data: null };
  }
}

/**
 * Get the organizations a user is a member of
 * @param {string} username - The username of the user
 * @returns {Promise<Object>} - Returns error and organization data
 */
async function getUserOrganizationsInDB(username) {
    if (!username || typeof username !== 'string' || username.trim() === '') {
        return { error: error.invalidUsername || { message: "Invalid username" }, data: null };
    }

    try {
        const organizations = await getUserOrganizations(username);
        
        if (!organizations || organizations.length === 0) {
            return { 
                error: null, 
                data: [] 
            };
        }

        // Map database fields to API fields
        const formattedOrganizations = organizations.map(org => ({
            org_id: org.organization_id,
            org_name: org.organization_name,
            org_description: org.organization_description,
            org_category: org.organization_category,
            org_contact_email: org.contact_email,
            org_phone_number: org.phone_number
        }));

        return { error: null, data: formattedOrganizations };
    } catch (err) {
        console.error("Error in getUserOrganizationsInDB:", err);
        return { error: error.databaseError || { message: "Database error occurred" }, data: null };
    }
}

module.exports = {
    getSpecificOrgDataInDB,
    createOrganizationInDB,
    updateOrganizationInDB,
    getAllOrganizationDataInDB,
    getUserOrganizationsInDB
};
