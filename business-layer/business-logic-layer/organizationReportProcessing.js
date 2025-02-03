const Error = require("./public/errors.js");
const error = new Error();


async function getSpecificReportOrgData( orgId, memberId ) {
    
    // TODO: call db
  
    /*
    Data should be displayed as:

    "organization_id": 1,
    "organization_name": "Women In Computing",
    "organization_abbreviation": "WiC",
    "meeting_id": 2341,
    "meeting_type": "event",
    "meeting_date": "2025-02-01",
		"attendance": {
			"total_attendance": 13,
			"active_member_attendance": 4,
			"inactive_member_attendance": 9,
			"members_who_attended": [
				{
			    "member_id": 0291,
			    "role_num": 1,
			    "firstName": "Phoebe",
			    "lastName": "Wong",
			    "rit_username": "pw3919",
			    "phone": 2319239140
		    },
		    ...
          ]
        }
    */
    return {error: error.noError, data: "data-here"}
  }



module.exports = {
  getSpecificReportOrgData,
};