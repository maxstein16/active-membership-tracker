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
  return {error: error.noError, data: "data-here"}
}


async function editMemberInOrganization( orgId, memberId, memberDataToUpdate ) {
    
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
  return {error: error.noError, data: "data-here"}
}


async function deleteMemberInOrganization( orgId, memberId ) {
    
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
  return {error: error.noError, data: "data-here"}
}

async function getMembersInOrganization(orgId) {
  // TODO: call db and fetch members

  /*
  Expected Response:
  {
    "status": "success",
    "data": [
      {
        "member_id": 1,
        "member_name": "Jane Doe",
        "member_email": "jd1234@rit.edu",
        "member_major": "Computer Science",
        "member_graduation_date": "2025-05-15",
        "role": 2,
        "joined_date": "2023-09-01T00:00:00Z"
      },
      {
        "member_id": 2,
        "member_name": "John Smith",
        "member_email": "js5678@rit.edu",
        "member_major": "Software Engineering",
        "member_graduation_date": "2024-12-15",
        "role": 0,
        "joined_date": "2023-09-01T00:00:00Z"
      }
    ],
    "count": 2
  }
  */
  return { error: error.noError, data: "data-here" };
}

async function updateMemberAttendanceInOrganization(orgId, memberId, attendanceData) {
  // TODO: call db and update attendance

  /*
  Expected Response:
  {
    "status": "success",
    "data": {
      "member_id": 1041,
      "organization_abr": "WiC",
      "meetings_attended": 5,
      "volunteer_events": 1,
      "social_events": 1,
      "points": 36,
      "isActiveMember": false
    }
  }
  */
  return { error: error.noError, data: "data-here" };
}

  
  module.exports = {
    getSpecificMemberWithOrgData,
    addMemberToAnOrganization,
    editMemberInOrganization,
    deleteMemberInOrganization,
    getMembersInOrganization,
    updateMemberAttendanceInOrganization
  };
  