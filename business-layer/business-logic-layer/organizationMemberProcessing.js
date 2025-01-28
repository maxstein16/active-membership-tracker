const Error = require("./public/errors.js");
const error = new Error();

async function getSpecificMemberWithOrgData( orgId, memberId ) {
    
    // TODO: call db
  
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
    return {error: error.noError, data: "data-here"}
  }


async function addMemberToAnOrganization( orgId, memberData ) {
    
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
  return {error: error.noError}
}

  
  module.exports = {
    getSpecificMemberWithOrgData,
    addMemberToAnOrganization
  };
  