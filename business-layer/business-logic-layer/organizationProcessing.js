const { ROLE_ADMIN } = require("../constants.js");
const { createEmailSettings } = require("../data-layer/email-settings.js");
const {
  createMembership,
  getMembershipByAttributes,
  getMembershipsByAttributes,
} = require("../data-layer/membership.js");
const {
  getOrganizationById,
  createOrganization,
  updateOrganizationByID,
  getOrganizations,
  getUserOrganizations,
} = require("../data-layer/organization.js");
const { getCurrentSemester } = require("../data-layer/semester.js");
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
    organization_description,
    organization_color,
    organization_abbreviation,
    organization_email,
    organization_membership_type,
    organization_threshold,
  } = fields;

  // Validate organization name (required & non-empty string)
  if (
    organization_name !== undefined &&
    (typeof organization_name !== "string" || organization_name.trim() === "")
  ) {
    return error.invalidOrgName;
  }

  // Validate organization abbreviation (optional, but if provided must be non-empty string)
  if (
    organization_abbreviation !== undefined &&
    (typeof organization_abbreviation !== "string" ||
      organization_abbreviation.trim() === "")
  ) {
    return error.invalidOrgShortening;
  }

  // Validate organization description (optional, if provided must be a string)
  if (
    organization_description !== undefined &&
    (typeof organization_description !== "string" ||
      organization_description.trim() === "")
  ) {
    return error.invalidOrgDescription;
  }

  // Validate organization color (optional hex color, format: #FFFFFF)
  if (
    organization_color !== undefined &&
    (typeof organization_color !== "string" ||
      organization_color.trim() === "" ||
      !/^#[0-9A-Fa-f]{6}$/.test(organization_color))
  ) {
    return error.invalidOrgColor;
  }

  // Validate membership type (optional, if provided must be non-empty string)
  if (
    organization_membership_type !== undefined &&
    (typeof organization_membership_type !== "string" ||
      organization_membership_type.trim() === "")
  ) {
    return error.invalidOrgmembership_type;
  }

  // Validate email (optional, but if provided must be valid email)
  if (
    organization_email !== undefined &&
    (typeof organization_email !== "string" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        organization_email
      ))
  ) {
    return error.invalidOrgEmail;
  }

  // Validate threshold (optional, if provided must be a number)
  if (
    organization_threshold !== undefined &&
    typeof organization_threshold !== "number"
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
    organization_name: orgData.organization_name,
    organization_color: orgData.organization_color,
    organization_abbreviation: orgData.organization_abbreviation,
    organization_description: orgData.organization_description,
    organization_threshold: orgData.organization_threshold,
    organization_membership_type: orgData.organization_membership_type,
    organization_email: orgData.organization_email,
  };
}

/**
 * Maps database fields to API fields
 * @param {Object} dbData - Organization data with database field names
 * @returns {Object} Organization data with API field names
 */
function mapToApiFields(dbData) {
  return {
    organization_id: dbData.organization_id,
    organization_name: dbData.organization_name,
    organization_color: dbData.organization_color,
    organization_abbreviation: dbData.organization_abbreviation,
    organization_description: dbData.organization_description,
    organization_threshold: dbData.organization_threshold,
    organization_membership_type: dbData.organization_membership_type,
    organization_email: organization_email,
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
async function createOrganizationInDB(orgData, memberId) {

  const validationError = validateOrgFields(orgData);
  if (validationError) {
    return { error: validationError, data: null };
  }

  try {
    const newOrganization = await createOrganization({
      organization_name: orgData.organization_name,
      organization_description: orgData.organization_description,
      organization_color: orgData.organization_color,
      organization_abbreviation: orgData.organization_abbreviation,
      organization_threshold: orgData.organization_threshold,
      organization_email: orgData.organization_email,
      organization_membership_type: orgData.organization_membership_type,
    });

    // add the current user as admin
    const currentSemester = await getCurrentSemester();

    const membership = await createMembership({
      membership_role: ROLE_ADMIN,
      member_id: memberId,
      membership_points: 0,
      active_member: false,
      organization_id: newOrganization.organization_id,
      semester_id: currentSemester.semester_id,
    });

    if (!membership) {
      return { error: error.couldNotCreateMembership, data: null };
    }

    // create email settings for the org
    const newEmailSettings = await createEmailSettings(
      newOrganization.organization_id,
      {
        current_status: true,
        annual_report: true,
        semester_report: true,
        membership_achieved: true,
      }
    );

    return {
      error: null,
      data: {
        ...newOrganization.dataValues,
        email_setting_id: newEmailSettings.email_setting_id,
      },
    };
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
  if (isNaN(orgId) || orgId <= 0) {
    return { error: error.invalidOrganizationId, data: null };
  }

  if (orgDataToUpdate.length === 0) {
    return { error: error.mustHaveAtLeastOneFieldToEditOrg, data: null };
  }

  try {
    const updateSuccess = await updateOrganizationByID(orgId, orgDataToUpdate);

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

// /**
//  * Get the organizations a user is a member of
//  * @param {string} username - The username of the user
//  * @returns {Promise<Object>} - Returns error and organization data
//  */
// async function getUserOrganizationsInDB(username) {
//   if (!username || typeof username !== "string" || username.trim() === "") {
//     return {
//       error: error.invalidUsername || { message: "Invalid username" },
//       data: null,
//     };
//   }

//   try {
//     const organizations = await getUserOrganizations(username);

//     if (!organizations || organizations.length === 0) {
//       return {
//         error: null,
//         data: [],
//       };
//     }

//     // Map database fields to API fields
//     const formattedOrganizations = organizations.map((org) => ({
//       organization_id: org.organization_id,
//       organization_name: org.organization_name,
//       organization_description: org.organization_description,
//       organization_color: org.organization_color,
//       organization_threshold: org.organization_threshold,
//       organization_membership_type: org.organization_membership_type,
//       organization_email: org.email,
//     }));

//     return { error: null, data: formattedOrganizations };
//   } catch (err) {
//     console.error("Error in getUserOrganizationsInDB:", err);
//     return {
//       error: error.databaseError || { message: "Database error occurred" },
//       data: null,
//     };
//   }
// }

async function getUserOrganizationsInDB(memberId) {
  try {
    // get all the memberships
    const memberships = await getMembershipsByAttributes({
      member_id: memberId,
    });

    if (!memberships) {
      return { error: error.membershipNotFound };
    }

    console.log(memberships)

    // get all their orgs
    const membershipDetails = await Promise.all(
      memberships.map(async (membership) => {
        const org = await getOrganizationById(membership.organization_id);
        return {
          ...membership.toJSON(),
          organization: org ? org.toJSON() : null,
        };
      })
    );

    return { data: membershipDetails }
  } catch (error) {
    console.log(error)
    return { error: "Error getting my organization data from database" };
  }
}

module.exports = {
  getSpecificOrgDataInDB,
  createOrganizationInDB,
  updateOrganizationInDB,
  getAllOrganizationDataInDB,
  getUserOrganizationsInDB,
};
