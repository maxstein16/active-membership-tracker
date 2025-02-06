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
