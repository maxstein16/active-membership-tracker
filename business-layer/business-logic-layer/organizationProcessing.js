const Error = require("./public/errors.js");
const error = new Error();

async function getSpecificOrgData(orgId) {
  // check that the params are valid
  // example: organization id must be an integer)
  // Validate that orgId is an integer
  if (!Number.isInteger(orgId)) {
    return { error: error.invalidParameter, data: null };
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
/*
  Data should be displayed as:

    {
      "member_id": 1,
      "member_name": "Jane Doe",
      "member_email": "jd1234@rit.edu",
      "member_personal_email": "jane.doe@gmail.com",
      "member_phone_number": "555-0123",
      "member_graduation_date": "2025-05-15",
      "member_tshirt_size": "M",
      "member_major": "Computer Science",
      "member_gender": "F",
      "member_race": "Asian",
      "membership": {
        "membership_id": 101,
        "organization_id": 1,
        "role": 2
      }
    }
  */

async function addOrganization(orgId, orgData) {
  // TODO: call db

  // check that the user is an admin or eboard
  const userId = req.session.user.userId;
  const roleInfo = await getMembershipRoleInfoInOrganization(orgId, userId);

  if (!roleInfo || (roleInfo.role !== 2 && roleInfo.role !== 1)) {
    return { error: error.permissionDenied, data: null }; // User does not have permission
  }

  // check that the params are valid
  if (!orgId || typeof orgId !== 'number' || orgId <= 0) {
    return { error: error.invalidOrganizationId, data: null }; // Invalid orgId
  }

  // Check for missing required fields
  const requiredFields = [
    "org_name",
    "org_description",
    "org_category",
    "org_contact_email",
    "org_phone_number"
  ];

  for (const field of requiredFields) {
    if (!orgData[field]) {
      return { error: error.mustHaveAllFieldsAddOrg, data: null }; // Missing field
    }
  }

  // Validate organization attributes
  const { org_name, org_description, org_category, org_contact_email, org_phone_number } = orgData;

  if (typeof org_name !== 'string' || org_name.trim() === '') {
    return { error: error.invalidOrgName, data: null }; // Invalid org_name
  }

  if (typeof org_description !== 'string' || org_description.trim() === '') {
    return { error: error.invalidOrgDescription, data: null }; // Invalid org_description
  }

  if (typeof org_category !== 'string' || org_category.trim() === '') {
    return { error: error.invalidOrgCategory, data: null }; // Invalid org_category
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (typeof org_contact_email !== 'string' || !emailRegex.test(org_contact_email)) {
    return { error: error.invalidOrgEmail, data: null }; // Invalid contact email
  }

  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  if (typeof org_phone_number !== 'string' || !phoneRegex.test(org_phone_number)) {
    return { error: error.invalidOrgPhoneNumber, data: null }; // Invalid phone number
  }

  // Call the data layer method to create the organization
  try {
    const newOrganization = await createOrganization(orgId, orgData);

    if (!newOrganization) {
      return { error: error.addOrgFailed, data: null }; // Organization creation failed
    }
    return { error: error.noError, data: newOrganization };
  } catch (err) {
    return { error: error.databaseError, data: null }; // Database error
  }
}


async function editOrganization(orgId, orgDataToUpdate) {
  // TODO: call db

  /**
   *ORG ATTRIBUTES
   org_name: orgData.org_name,
      org_description: orgData.org_description,
      org_category: orgData.org_category,
      org_contact_email: orgData.org_contact_email,
      org_phone_number: orgData.org_phone_number
   */

  return { error: error.noError, data: "data-here" };
}

async function deleteOrganization(orgId) {
  // TODO: call db

  /*

  Data should be displayed as:

    {
      "message": "Membership successfully removed",
      "membership_id": 102,
      "member_id": 2,
      "organization_id": 1,
      "removed_at": "2024-04-03T14:40:00Z",
      "removed_by": "admin@rit.edu"
    }

  */
  return { error: error.noError, data: "data-here" };
}

async function getAllOrganizationData() {
  // TODO: call db

  /*

  Data should be displayed as:

    {
      "message": "Membership successfully removed",
      "membership_id": 102,
      "member_id": 2,
      "organization_id": 1,
      "removed_at": "2024-04-03T14:40:00Z",
      "removed_by": "admin@rit.edu"
    }

  */
  return { error: error.noError, data: "data-here" };
}

module.exports = {
  getSpecificOrgData,
  addOrganization,
  editOrganization,
  deleteOrganization,
  getAllOrganizationData,
};
