const Error = require("./public/errors.js");
const error = new Error();

async function getOrganizationSettings( orgId ) {
    
    // TODO: call db
  
    /*

    Data should be displayed as:

      {
        "organization_id": 1,
        "organization_name": "Women In Computing",
        "active_membership_requirements": [
            {
                "settingId": 0,
                "meeting_type": "voluneering",
                "frequency": "semesterly",
                "amount_type": "points",
                "amount": 3
            },
            {
                "settingId": 2,
                "meeting_type": "meetings",
                "frequency": "anually",
                "amount_type": "percentage",
                "amount": 0.5
            }
        ],
        "email_settings": {
            "current_status": "never",
            "annual_report": "yes",
            "semester_report": "no"
        }
    }

    */
    return {error: error.noError, data: "data-here"}
  }


async function editOrganizationMembershipRequirements( orgId, orgData ) {
    
  // TODO: call db

  /*

  Data should be displayed as:

    {
        "organization_id": 1,
        "organization_name": "Women In Computing",
        "active_membership_requirements": [
            {
                "setting_id": 0
                "meeting_type": "event",
                "frequency": "semesterly",
                "amount_type": "points",
                "amount": 3
            },
            {
                "setting_id": 2
                "meeting_type": "meetings",
                "frequency": "anually",
                "amount_type": "percentage",
                "amount": 0.5
            }
        ]
    }

  */
  return {error: error.noError, data: "data-here"}
}


async function editOrganizationEmailSettings( orgId, orgData ) {
    
  // TODO: call db

  /*

  Data should be displayed as:

    {
        "organization_id": 1,
        "organization_name": "Women In Computing",
        "email_settings": {
            "current_status": "never",
            "annual_report": "yes",
            "semester_report": "no"
            "membership_achieved": "yes"
        }
    }

  */
  return {error: error.noError, data: "data-here"}
}


async function deleteOrganizationMembershipRequirement( orgId, membershipId ) {
    
  // TODO: call db

  /*

  Data should be displayed as:

    {
        "organization_id": 1,
        "organization_name": "Women In Computing",
        "active_membership_requirements": [
            {
                "settingId": 0,
                "meeting_type": "voluneering",
                "frequency": "semesterly",
                "amount_type": "points",
                "amount": 3
            },
            {
                "settingId": 2,
                "meeting_type": "meetings",
                "frequency": "anually",
                "amount_type": "percentage",
                "amount": 0.5
            }
        ]
    }

  */
  return {error: error.noError, data: "data-here"}
}

module.exports = {
    getOrganizationSettings,
    editOrganizationMembershipRequirements,
    editOrganizationEmailSettings,
    deleteOrganizationMembershipRequirement
};
  