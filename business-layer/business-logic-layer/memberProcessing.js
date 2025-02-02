const Error = require("./public/errors.js");
const error = new Error();

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
  getSpecificMemberOrgStats
};
