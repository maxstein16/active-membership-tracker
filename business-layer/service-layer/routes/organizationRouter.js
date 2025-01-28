let express = require("express");
const router = express.Router({mergeParams: true});

/*

https://api.rit.edu/v1/organization/{orgId}

*/

// GET /v1/organization/{orgId}
router.get("/", function (req, res) {
  res.status(200).json({ message: "Hello Organization", org: req.params.orgId });
});



// GET /v1/organization/{orgId}/annual-report
router.get('/annual-report', function(req, res){
  res.status(200).json({message: 'Annual Report for ' + meetingId, org: req.params.orgId});
  
  // code from the jira -- the data this is meant to play with 
  /*
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
		    },
		    ...
	    ]
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
  */

});

// 404 error
router.get('/annual-report', function(req, res){
  res.status(404).json({ error: "organization with id of {orgId} not found" });
});

// 500 error
router.get('/annual-report', function(req, res){
  res.status(500).json({ error: "Error Creating Report" });
});



// GET /v1/organization/{orgId}/meeting-report?id={meetingId}
router.get('/meeting-report?id={meetingId}', function(req, res){
  res.status(200).json({message: 'Meeting Report for ' + meetingId, org: req.params.orgId});

  // code from the jira -- the data this is meant to play with 
  /*
  {
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

});

// 404 error
router.get('/', function(req, res){
  res.status(404).json({ error: "Organization with id of " + {orgId} + "not found" });
});

// 404 error
router.get('/meeting-report?id={meetingId}', function(req, res){
  res.status(404).json({ error: "Meeting with id of " + {meetingId} + "not found" });
});

// 500 error
router.get('/meeting-report?id={meetingId}', function(req, res){
  res.status(500).json({ error: "Error Creating Report" });
});

module.exports = router;
