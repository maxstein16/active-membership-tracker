const Error = require("./public/errors.js");
const error = new Error();
const { Member, Membership, Organization, Event, Attendance } = require("../db"); // Import database models
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../db");

//const { getMemberById } = require("../business-logic-layer/memberProcessing");
//const { getAllEventsByOrganization } = require("../business-logic-layer/eventsProcessing");
//const { getEventById } = require("../business-logic-layer/eventsProcessing");
//const { getSpecificOrgData } = require("../business-logic-layer/organizationProcessing");
//const { getAllMembershipsInOrganization } = require("../business-logic-layer/organizationMembershipProcessing");


//note: route for getAllEventsByOrganization method doesn't work currently. will be calling DB manually to get data for now
//may revise this with method calls after routes/paths are fixed

async function getSpecificReportOrgData( orgId, memberId ) {
    
    // TODO: call db
    var memberguy = getMemberById(1);

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
    //return {error: error.noError, data: "data-here"}
    return {error: error.noError, data: memberguy};
  }


  async function getAnnualOrgReport(organizationId, year) {    
    const d = new Date();
    year = 2024;
    let start_year = year + "-01-01 00:00:00";
    let end_year = (year + 1) + "-01-01 00:00:00";

    var totalMembers, new_members, total_active, new_active = 0;
    var orgName = "";
    var shortOrg = "";
    
   try {
   
    const members = await sequelize.query('SELECT Member.member_id, Member.member_name, Membership.membership_role, Member.member_email, Member.member_phone_number FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ?', {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const activeMembers = await sequelize.query('SELECT Member.member_id, Member.member_name FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ?', {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const organization = await sequelize.query('SELECT organization_id, organization_name, organization_abbreviation FROM `Organization` WHERE organization_id = ?', {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const events = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? `, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const meetings = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? AND event_type = 'general_meeting'`, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const volunteering = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? AND event_type = 'volunteer'`, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const attendance = await sequelize.query(`SELECT Attendance.attendance_id FROM Attendance JOIN Event ON Attendance.event_id = Event.event_id WHERE Event.organization_id = ? AND check_in >= ? AND check_in < ? `, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
    });

    start_year = (year-1) + "-01-01 00:00:00";
     end_year = year  + "-01-01 00:00:00";


     const previousMembers = await sequelize.query(`SELECT Member.member_id FROM Member INNER JOIN Membership ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ? AND Membership.createdAt >= ? AND Membership.createdAt < ?`, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
    });

    const previousActiveMembers = await sequelize.query(`SELECT Member.member_id, Member.member_name FROM Member INNER JOIN Membership ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ? AND Membership.createdAt >= ? AND Membership.createdAt < ?`, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
    });

     const previousEvents = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? `, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const previousMeetings = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? AND event_type = 'general_meeting'`, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const previousVolunteering = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? AND event_type = 'volunteer'`, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const previousAttendance = await sequelize.query(`SELECT Attendance.attendance_id FROM Attendance JOIN Event ON Attendance.event_id = Event.event_id WHERE Event.organization_id = ? AND check_in >= ? AND check_in < ? `, {
      replacements: [organizationId, start_year, end_year],
      type: QueryTypes.SELECT,
    });

    const previousYearNewMember = await sequelize.query(`SELECT Member.member_id FROM Member INNER JOIN Membership ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ? AND Membership.createdAt >= ? AND Membership.createdAt < ?`, {
      replacements: [organizationId, start_year-1, end_year-1],
      type: QueryTypes.SELECT,
    });

    const previousYearNewActiveMember = await sequelize.query(`SELECT Member.member_id, Member.member_name FROM Member INNER JOIN Membership ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ? AND Membership.createdAt >= ? AND Membership.createdAt < ?`, {
      replacements: [organizationId, start_year-1, end_year-1],
      type: QueryTypes.SELECT,
    });


    let newMemberCount = members.length - previousMembers.length;
    let newActiveMemberCount = activeMembers.length - previousActiveMembers.length;

    let previousYearNewMemberCount = previousYearNewMember.length - previousMembers.length;
    let previousYearNewActiveMemberCount = previousYearNewActiveMember.length - previousActiveMembers.length;

    console.log(meetings);
    console.log(volunteering);

    console.log("attendance!!");
    console.log(attendance);
    //sample to test join
    // const test = await sequelize.query('SELECT Member.member_id, Member.member_name FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id', {
    //   logging: console.log,
    //   raw: true,
    //   type: QueryTypes.SELECT,
    // });

    // if (!members.length && !org.length) {
    //   return { error: error.noError, data: "data is empty" };
    // }

   const jsonResponse = {
    "organization_id": organizationId,
    "organization_name": organization.organization_name,
    "organization_abbreviation": organization.organization_abbreviation,
    // "current_year": current_year,
    "member-data": {
      "total_members": members.length,
      "new_members": newMemberCount,
      "total_active_members": activeMembers.length,
      "new_active_members": newActiveMemberCount,
      "members": members.map(member => ({
        "member_id": member.member_id,
        "role_num": member.role_num,
        "firstName": member.member_name.split(" ")[0],
        "lastName": member.member_name.split(" ")[1],
        "rit_username": member.member_email.split("@")[0],
        "phone": member.member_phone_number
      }))
    },
    "member-data-last-year": {
          "total_members": previousMembers.length,
          "new_members": previousYearNewMemberCount,
          "total_active_members": previousActiveMembers.length,
          "new_active_members": previousYearNewActiveMemberCount,
      },
        
      "meetings_data_this_year": {
          "number_of_meetings": meetings.length,
          "number_of_events": events.length,
          "number_of_volunteering": volunteering.length,
          "total_attendance": attendance.length
      },
        
      "meetings_data_last_year": {
          "number_of_meetings": previousMeetings.length,
          "number_of_events": previousEvents.length,
          "number_of_volunteering": previousVolunteering.length,
          "total_attendance": previousAttendance.length
      }
  };

    return { error: error.noError, data: jsonResponse };

   } catch (err) {
    console.error("Error fetching member by ID:", err);
    return { error: error.somethingWentWrong, data: null };
   } 
   
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


  }

  async function getSemesterOrgReport(organizationId, semesterId) {

   //var orgThing = getAllEventsByOrganization(1);
   var report = "";

   const members = await sequelize.query('SELECT Member.member_id, Member.member_name, Membership.membership_role, Member.member_email, Member.member_phone_number FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ?', {
    replacements: [organizationId],
    type: QueryTypes.SELECT,
  });

  const activeMembers = await sequelize.query('SELECT Member.member_id, Member.member_name FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ?', {
    replacements: [organizationId],
    type: QueryTypes.SELECT,
  });

  const organization = await sequelize.query('SELECT organization_id, organization_name, organization_abbreviation FROM `Organization` WHERE organization_id = ?', {
    replacements: [organizationId],
    type: QueryTypes.SELECT,
  });

  const events = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? `, {
    replacements: [organizationId, start_year, end_year],
    type: QueryTypes.SELECT,
    logging: console.log,
  });

  const meetings = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? AND event_type = 'general_meeting'`, {
    replacements: [organizationId, start_year, end_year],
    type: QueryTypes.SELECT,
    logging: console.log,
  });

  const volunteering = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_start >= ? AND event_end < ? AND event_type = 'volunteer'`, {
    replacements: [organizationId, start_year, end_year],
    type: QueryTypes.SELECT,
    logging: console.log,
  });

  const attendance = await sequelize.query(`SELECT Attendance.attendance_id FROM Attendance JOIN Event ON Attendance.event_id = Event.event_id WHERE Event.organization_id = ? AND check_in >= ? AND check_in < ? `, {
    replacements: [organizationId, start_year, end_year],
    type: QueryTypes.SELECT,
  });


    

    const jsonResponse = {
      "organization_id": organizationId,
      "organization_name": organization.organization_name,
      "organization_abbreviation": organization.organization_abbreviation,
      // "current_year": current_year,
      "current_semester_start": '01-12-2025',
    "current_semester_end": '05-12-2025',
      "member-data": {
        "total_members": members.length,
        "new_members": newMemberCount,
        "total_active_members": activeMembers.length,
        "new_active_members": newActiveMemberCount,
        "members": members.map(member => ({
          "member_id": member.member_id,
          "role_num": member.role_num,
          "firstName": member.member_name.split(" ")[0],
          "lastName": member.member_name.split(" ")[1],
          "rit_username": member.member_email.split("@")[0],
          "phone": member.member_phone_number
        }))
      },

      "member_data_last_sem": {
            "total_members": previousMembers.length,
            "new_members": previousYearNewMemberCount,
            "total_active_members": previousActiveMembers.length,
            "new_active_members": previousYearNewActiveMemberCount,
        },
          
        "meetings_data_this_sem": {
            "number_of_meetings": meetings.length,
            "number_of_events": events.length,
            "number_of_volunteering": volunteering.length,
            "total_attendance": attendance.length
        },
          
        "meetings_data_last_sem": {
            "number_of_meetings": previousMeetings.length,
            "number_of_events": previousEvents.length,
            "number_of_volunteering": previousVolunteering.length,
            "total_attendance": previousAttendance.length
        }
    };
  
   return {error: error.noError, data: report}


   /**
    * {
  "status": "success",
  "data": {
    "organization_id": 1,
    "organization_name": "Women In Computing",
    "organization_abbreviation": "WiC",
    "current_year": 2025, 
    "current_semester_start": 01-12-2025,
    "current_semester_end": 05-12-2025,
    "member-data-this-sem": {
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
		    },
		    ...
	    ]
    },
    "member-data-last-sem": {
	    "total_members": 35,
	    "new_members": 4,
	    "total_active_members": 16,
	    "new_active_members": 6,
    }
    "meetings_data_this_sem": {
	    "number_of_meetings": 35,
	    "number_of_events": 329,
	    "number_of_volunteering": 23,
	    "total_attendance": 32942
    },
    "meetings_data_last_sem": {
	    "number_of_meetings": 35,
	    "number_of_events": 329,
	    "number_of_volunteering": 23,
	    "total_attendance": 32942
    }
  }
}
    */
   
  }

  //NOTE The current path for this does NOT work as defined in organizationReportsRouter. This method has NOT been tested.
  async function getMeetingOrgReport (organizationId, meetingId) {
    const organization = await sequelize.query('SELECT organization_id, organization_name, organization_abbreviation FROM `Organization` WHERE organization_id = ?', {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const meetingData = await sequelize.query(`SELECT event_id, event_start, event_end FROM Event WHERE organization_id = ? AND event_id = ?`, {
      replacements: [organizationId, meetingId],
      type: QueryTypes.SELECT,
      logging: console.log,
    });

    const members = await sequelize.query('SELECT Member.member_id, Member.member_name, Membership.membership_role, Member.member_email, Member.member_phone_number FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ?', {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const activeMembers = await sequelize.query('SELECT Member.member_id, Member.member_name FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = ?', {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const attendance = await sequelize.query(`SELECT Attendance.attendance_id FROM Attendance JOIN Event ON Attendance.event_id = Event.event_id WHERE Event.organization_id = ? `, {
      replacements: [organizationId],
      type: QueryTypes.SELECT,
    });

    const jsonResponse = {
      "organization_id": organizationId,
      "organization_name": organization.organization_name,
      "organization_abbreviation": organization.organization_abbreviation,
      "meeting_id": meetingId,
      "meeting_type": meetingData.event_type,
      "meeting_date": meetingData.event_start,
      "attendance": {
        "total_attendance": attendance.length,
        "active_member_attendance": 4,
        "inactive_member_attendance": 9,
        "members_who_attended": members.map(member => ({
          "member_id": member.member_id,
          "role_num": member.role_num,
          "firstName": member.member_name.split(" ")[0],
          "lastName": member.member_name.split(" ")[1],
          "rit_username": member.member_email.split("@")[0],
          "phone": member.member_phone_number
        }))
      },
    
    };


    return {error: error.noError, data: jsonResponse}
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


  }
  


module.exports = {
  getSpecificReportOrgData,
  getAnnualOrgReport,
  getSemesterOrgReport,
  getMeetingOrgReport
};