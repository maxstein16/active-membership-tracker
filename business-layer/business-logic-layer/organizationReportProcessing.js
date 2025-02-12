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


  async function getAnnualOrgReport(orgId) {
    //connect to db
    //in order to get the data for this report, do something like this....
    //for each entry in the Organization table, get the organization info
    //for each entry in the Organization table, get every Member
    //for every member, get their info
    //Count each entry in the Events table
     //Count each entry in the Attendance table

    /** 
     * {
      "status": "success",
      "data": {
        "organization_id": 1,
        "organization_name": "Women In Computing",
        "organization_abbreviation": "WiC",
        "current_year": 2025, 
        "member-data": {
          "total_members": 35,
          "new_members": 4,
          "total_active_members": 16,
          "new_active_members": 6,
          "members": [
            {
              "member_id": 0291,
              "role_num": 1,
              "firstName": "Phoebe",
              "lastName": "Wong",
              "rit_username": "pw3919",
              "phone": 2319239140
            }, //member entry
            ...
          ] members array
        }, member-data
        "member-data-last-year": {
          "total_members": 35,
          "new_members": 4,
          "total_active_members": 16,
          "new_active_members": 6,
        }
        "meetings_data_this_year": {
          "number_of_meetings": 35,
          "number_of_events": 329,
          "number_of_volunteering": 23,
          "total_attendance": 32942
        },
        "meetings_data_last_year": {
          "number_of_meetings": 35,
          "number_of_events": 329,
          "number_of_volunteering": 23,
          "total_attendance": 32942
        }
      }
    }
     * 
     */


    return {error: error.noError, data: "data-here"}
  }

  async function getSemesterOrgReport(orgId) {
   

    
    return {error: error.noError, data: "data-here"}
  }

  async function getMeetingOrgReport (orgId, meetingId) {


/**
   * {
    "status": "success",
    "data": {
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
    }
}
 */

/**
 * 	// check that the params are valid
		// example: organization id must be an integer
		
	// get the data from the data layer method
	
	// check the return to make sure it exists
		
		// if it does not: 
			// return an appropriate error from errors.js
					// if an appropriate error doesn't exist in errors.js, add a new one
					
		// if it does 
			// return error.noError from errors.js as well as the data listed in the api call documentation
}
 */



    return {error: error.noError, data: "data-here"}
  }
  


module.exports = {
  getSpecificReportOrgData,
  getAnnualOrgReport,
  getSemesterOrgReport,
  getMeetingOrgReport
};