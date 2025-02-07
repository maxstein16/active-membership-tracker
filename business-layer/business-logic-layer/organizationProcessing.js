const Error = require("./public/errors.js");
const error = new Error();


/**Also checking priviledges used to be a thing so I'll just put it here
 *   // // check that the user is an admin or eboard - removed
  // const userId = req.session.user.userId;
  // const roleInfo = await getMembershipRoleInfoInOrganization(orgId, userId);

  // if (!roleInfo || (roleInfo.role !== 2 && roleInfo.role !== 1)) {
  //   return { error: error.permissionDenied, data: null }; // User does not have permission
  // }

 * 
 */

// Helper function to validate fields
function validateOrgFields(fields) {
  const { org_name, org_description, org_category, org_contact_email, org_phone_number } = fields;

  if (org_name && (typeof org_name !== 'string' || org_name.trim() === '')) {
    return error.invalidOrgName;
  }

  if (org_description && (typeof org_description !== 'string' || org_description.trim() === '')) {
    return error.invalidOrgDescription;
  }

  if (org_category && (typeof org_category !== 'string' || org_category.trim() === '')) {
    return error.invalidOrgCategory;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (org_contact_email && (typeof org_contact_email !== 'string' || !emailRegex.test(org_contact_email))) {
    return error.invalidOrgEmail;
  }

  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  if (org_phone_number && (typeof org_phone_number !== 'string' || !phoneRegex.test(org_phone_number))) {
    return error.invalidOrgPhoneNumber;
  }

  return null;
}


async function getSpecificOrgData(orgId) {
  // check that the params are valid
  // example: organization id must be an integer)
  // Validate that orgId is an integer
  if (!Number.isInteger(orgId)) {
    return { error: error.organizationIdMustBeInteger, data: null };
  }

  // get the data from the data layer method
  const orgData = await getOrganizationById(orgId);
  // check the return to make sure it exists

  // if it does not:
  // return an appropriate error from errors.js
  // if an appropriate error doesn't exist in errors.js, add a new one
  if (!orgData) {
    return { error: error.notFound, data: null };
  }

  // if it does
  // return error.noError from errors.js as well as the data listed in the api call documentation

  return { error: error.noError, data: orgData };
}



async function addOrganization(orgId, orgData) {
  // Validate organization attributes
  const validationError = validateOrgFields(orgData);
  if (validationError) {
    return { error: error.validationError, data: null };
  }

  if (!Number.isInteger(orgId)) {
    return { error: error.organizationIdMustBeInteger, data: null };
  }
  // Call data layer method to create the organization
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


async function editOrganization(orgId, orgDataToUpdate) {
  try {
    // Validate orgId
    if (!Number.isInteger(orgId) || orgId <= 0) {
      return { error: error.invalidOrganizationId, data: null };
    }

    // Validate that at least one field is being updated
    const validFields = Object.keys(orgDataToUpdate);
    if (validFields.length === 0) {
      return { error: error.mustHaveAtLeastOneFieldToEditOrg, data: null };
    }

    // Run field validation for all provided fields
    const validationError = validateOrgFields(orgDataToUpdate);
    if (validationError) {
      return { error: validationError, data: null };
    }

    // Call data layer method to update the organization
    const updateSuccess = await updateOrganizationByID(orgId, orgDataToUpdate);
    if (updateSuccess) {
      return { error: error.noError, data: { message: "Organization updated successfully." } };
    } else {
      return { error: error.orgNotFound, data: null };
    }
  } catch (err) {
    console.error("Error updating organization:", err);
    return { error: error.databaseError, data: null };
  }
}




async function deleteOrganization(orgId) {

  // Check that the params are valid
  if (!Number.isInteger(orgId) || orgId <= 0) {
    return { error: error.invalidOrganizationId, data: null }; // Invalid orgId
  }

  try {
    // Attempt to find the organization by its ID
    const org = await Organization.getOrganizationById(orgId);

    // If the organization doesn't exist, return an error
    if (!org) {
      return { error: error.orgNotFound, data: null }; // Organization not found
    }

    // Delete the organization
    await org.destroy();

    // Assuming there is some logic to track who deleted the organization
    const deletionData = {
      message: 'Organization successfully deleted',
      org_id: orgId,
      removed_by: "admin@rit.edu",  // Example, adjust with real user data
      removed_at: new Date().toISOString(),
    };

    return { error: error.noError, data: deletionData };
  } catch (err) {
    console.error("Error deleting organization:", err);
    return { error: error.databaseError, data: null }; // Database error
  }
}

async function getAllOrganizationData() {
  try {
    const organizations = await getOrganizations(Organization);

    // Use .map() to format and validate each organization's fields
    const formattedOrganizations = organizations.map(org => {
      // Validate fields before mapping
      const error = validateOrgFields({
        org_name: org.organization_name,
        org_description: org.organization_description,
        org_category: org.organization_category,
        org_contact_email: org.contact_email,
        org_phone_number: org.phone_number
      });

      // If any error exists in validation, skip or handle accordingly
      if (error) {
        return { error: error, data: null }; // or handle error differently, like logging
      }

      // If validation passes, format and return the organization data
      return {
        org_id: org.id, // Assuming 'id' is the primary key
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
    console.error("Error getting organizations:", err);
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
