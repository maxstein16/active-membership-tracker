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

  // if you don't have the username in the params already:
  // go to the API call, add req.session.user.username,
  const userId = req.session.user.userId
  // add the param through the exports, and now you can use
  // their RIT username to check their privileges
  const roleInfo = await getMembershipRoleInfoInOrganization(orgId, userId);
  // if they are not an admin (2)or eboard (1) (using constants):
  if (!roleInfo || (roleInfo.role !== 2 && roleInfo.role !== 1)) {
    // return permission denied error from errors.js 
    return { error: error.permissionDenied, data: null }; // User does not have permission
  }

  // check that the params are valid
  // example: organization id must be an integer
  if (!orgId || typeof orgId !== 'number' || orgId <= 0) {
    return { error: error.invalidOrganizationId, data: null }; // Invalid orgId
  }

  // check that each item in the newObj or requestBody is what it should be
  // for example: a member id should be an int, a member name should be a string

  const requiredFields = [
    "org_name",
    "org_description",
    "org_category",
    "org_contact_email",
    "org_phone_number"
  ];

  //checking all items

  // Check for missing required fields
  for (const field of requiredFields) {
    if (!orgData[field]) {
      return { error: error.mustHaveAllFieldsAddOrg, data: null }; // Missing field
    }
  }

  // Validate organization name (string and non-empty)
  if (typeof orgData.org_name !== 'string' || orgData.org_name.trim() === '') {
    return { error: error.invalidOrgName, data: null }; // Invalid org_name
  }

  // Validate organization description (string and non-empty)
  if (typeof orgData.org_description !== 'string' || orgData.org_description.trim() === '') {
    return { error: error.invalidOrgDescription, data: null }; // Invalid org_description
  }

  // Validate organization category (string and non-empty)
  if (typeof orgData.org_category !== 'string' || orgData.org_category.trim() === '') {
    return { error: error.invalidOrgCategory, data: null }; // Invalid org_category
  }

  // Validate contact email with regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (typeof orgData.org_contact_email !== 'string' || !emailRegex.test(orgData.org_contact_email)) {
    return { error: error.invalidOrgEmail, data: null }; // Invalid contact email
  }

  // Validate phone number with regex (e.g., 555-123-4567)
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Example format: 555-123-4567
  if (typeof orgData.org_phone_number !== 'string' || !phoneRegex.test(orgData.org_phone_number)) {
    return { error: error.invalidOrgPhoneNumber, data: null }; // Invalid phone number
  }

  // Call the data layer method to create the organization
  try {
    const newOrganization = await createOrganization({
      org_name: orgData.org_name,
      org_description: orgData.org_description,
      org_category: orgData.org_category,
      org_contact_email: orgData.org_contact_email,
      org_phone_number: orgData.org_phone_number
    });


    // Check the return to make sure it exists
    if (!newOrganization) {
      return { error: error.addOrgFailed, data: null }; // Organization creation failed
    }
    return { error: error.noError, data: newOrganization };
  } catch (err) {
    return { error: error.databaseError, data: null }; // Database error
  }
}//addOrganization

async function editOrganization(orgId, orgDataToUpdate) {
  // TODO: call db

  /*

  Data should be displayed as:

    {
      "member": {
        "member_id": 2,
        "member_name": "John Smith",
        "member_email": "js5678@rit.edu",
        "member_personal_email": "john.smith@gmail.com",
        "member_phone_number": "555-0124",
        "member_graduation_date": "2024-12-15",
        "member_tshirt_size": "L",
        "member_major": "Software Engineering",
        "member_gender": "M",
        "member_race": "Caucasian"
      },
      "membership": {
        "membership_id": 102,
        "organization_id": 1,
        "member_id": 2,
        "role": 0
      }
    }

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
