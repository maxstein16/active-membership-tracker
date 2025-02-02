const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieves specific member data from the database.
 *
 * @param {number} memberId - The ID of the member to retrieve.
 * @returns {Object} - A response containing either an error or the member's data.
 *
 * Example response format:
 * {
 *   "status": "success",
 *   "data": {
 *     "member_id": 1,
 *     "member_name": "Jane Doe",
 *     "member_email": "jd1234@rit.edu",
 *     "member_personal_email": "jane.doe@gmail.com",
 *     "member_phone_number": "408-555-0123",
 *     "member_graduation_date": "2025-05",
 *     "member_tshirt_size": "M",
 *     "member_major": "Computer Science",
 *     "member_gender": "F",
 *     "member_race": "Asian",
 *     "memberships": [
 *       {
 *         "membership_id": 101,
 *         "organization_id": 1,
 *         "organization_name": "Women In Computing",
 *         "organization_abbreviation": "WiC",
 *         "role": 2
 *       }
 *     ]
 *   }
 * }
 */
async function getSpecificMemberData(memberId) {
  // TODO: Implement database call to fetch member data.
  return { error: error.noError, data: "data-here" };
}

async function getSpecificMemberOrgStats(memberId, orgId) {
  // TODO: Implement database call to fetch member data.
  return { error: error.noError, data: "data-here" };
}
module.exports = {
  getSpecificMemberData,
  getSpecificMemberOrgStats,
};
