const Error = require("./public/errors.js");
const error = new Error();

async function getAllOrgRecognitionsFromDB( orgId ) {
    
    // TODO: call db
  
    /*

    Data should be displayed as:
        
        "data": {
            "organization_id": 1,
            "organization_name": "Women In Computing",
            "organization_abbreviation": "WiC",
            "active_membership_threshold": 48, 
            "member_list": [
                {
                "member_id": 2,
                "membership_id": 102,
                "member_name": "John Smith Jr",
                "membership_years": 4,
                "meetings_attended": 13,
                "role": 0
                },
                {
                "member_id": 3,
                "membership_id": 103,
                "member_name": "Jane Smith",
                "membership_years": 3,
                "meetings_attended": 12,
                "role": 0
                }...
                ]
            }

    */
    return {error: error.noError, data: "data-here"}
  }


async function getSpecificRecognitionFromDB( orgId, memberId ) {
    
  // TODO: call db

  /*

  Data should be displayed as:

  "data": {
    "member_id": 2,
    "member_name": "John Smith Jr",
    "member_email": "js5678@rit.edu",
    "member_personal_email": "john.smith.new@gmail.com",
    "member_phone_number": "555-0125",
    "member_graduation_date": "2025-05-15",
    "member_tshirt_size": "XL",
    "member_major": "Software Engineering",
    "member_gender": "M",
    "member_race": "Caucasian",
    "membership": {
        "membership_id": 102,
        "membership_years": 4,
        "role": 0
        }
    }
    

  */
  return {error: error.noError, data: "data-here"}
}


async function updateSpecificRecognitionInDB( orgId, memberId, membershipYears ) {
    
  // TODO: call db

  /*

  Data should be displayed as:

    "data": {
	    "member_id": 2,
	    "member_name": "John Smith Jr",
	    "member_email": "js5678@rit.edu",
	    "member_personal_email": "john.smith.new@gmail.com",
	    "member_phone_number": "555-0125",
	    "member_graduation_date": "2025-05-15",
	    "member_tshirt_size": "XL",
	    "member_major": "Software Engineering",
	    "member_gender": "M",
	    "member_race": "Caucasian",
	    "membership": {
	      "membership_id": 102,
	      "membership_years": 4,
	      "role": 0
	    }
	  },

  */
  return {error: error.noError, data: "data-here"}
}

  module.exports = {
    getAllOrgRecognitionsFromDB,
    getSpecificRecognitionFromDB,
    updateSpecificRecognitionInDB
  };
  