const Error = require("./public/errors.js");
const error = new Error();

async function getMemberById( memberId ) {
    
    // TODO: call db
  
    /*

    Data should be displayed as:

    {
        "member_id": 1,
        "member_name": "Jane Doe",
        "member_email": "jd1234@rit.edu",
        "member_personal_email": "jane.doe@gmail.com",
        "member_phone_number": "408-555-0123",
        "member_graduation_date": "2025-05",
        "member_tshirt_size": "M",
        "member_major": "Computer Science",
        "member_gender": "F",
        "member_race": "Asian",
        "memberships": [
            {
                "membership_id": 101,
                "organization_id": 1,
                "organization_name": "Women In Computing",
                "organization_abbreviation": "WiC",
                "role": 2
            },
        ]
    }

    */
    return {error: error.noError, data: "data-here"}
}

async function updateMemberInDB( memberId, memberData ) {
    // TODO: call db
  
    /*

    Data should be displayed as:

    {
        "member_id": 1,
        "member_name": "Jane Doe",
        "member_email": "jd1234@rit.edu",
        "member_personal_email": "jane.doe@gmail.com",
        "member_phone_number": "408-555-0123",
        "member_graduation_date": "2025-05",
        "member_tshirt_size": "M",
        "member_major": "Computer Science",
        "member_gender": "F",
        "member_race": "Asian",
        "memberships": [
            {
                "membership_id": 101,
                "organization_id": 1,
                "organization_name": "Women In Computing",
                "organization_abbreviation": "WiC",
                "role": 2
            },
        ]
    }

    */
    return {error: error.noError, data: "data-here"}
}

async function createMemberInDB( memberData ) {
    // TODO: call db
  
    /*

    Data should be displayed as:

    {
        "member_id": 1,
        "member_name": "Jane Doe",
        "member_email": "jd1234@rit.edu",
        "member_personal_email": "jane.doe@gmail.com",
        "member_phone_number": "408-555-0123",
        "member_graduation_date": "2025-05",
        "member_tshirt_size": "M",
        "member_major": "Computer Science",
        "member_gender": "F",
        "member_race": "Asian",
        "memberships": [
            {
                "membership_id": 101,
                "organization_id": 1,
                "organization_name": "Women In Computing",
                "organization_abbreviation": "WiC",
                "role": 2
            },
        ]
    }

    */

    return {error: error.noError, data: "data-here"}
}

async function getSpecificMemberOrgStats(memberId, orgId) {
  // TODO: Implement database call to fetch member data.

  /*
    Data should be displayed as:
      {
        "member_id": 1,
        "organization_id": 1,
        "membership_id": 101,
        "organization_name": "Women In Computing",
        "organization_abbreviation": "WiC",
        "meetings_attended": 5,
        "volunteer_events": 1,
        "social_events": 1,
        "your_points": 36,
        "active_membership_threshold": 48,
        "isActiveMember": false
      }
    */
  return { error: error.noError, data: "data-here" };
}

module.exports = {
  getMemberById,
  updateMemberInDB,
  createMemberInDB,
  getSpecificMemberOrgStats
};
