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

/**
 * Adds a new member to the database.
 *
 * @param {Object} memberData - The data of the new member.
 * @returns {Object} - A response containing either an error or the newly added member's data.
 *
 * Example response format:
 * (Same as getSpecificMemberData)
 */
async function addMember(memberData) {
  // TODO: Implement database call to add a new member.
  return { error: error.noError, data: "data-here" };
}

/**
 * Edits an existing member's information in the database.
 *
 * @param {number} memberId - The ID of the member to update.
 * @param {Object} memberDataToUpdate - The fields to update for the member.
 * @returns {Object} - A response containing either an error or the updated member's data.
 *
 * Example response format:
 * (Same as getSpecificMemberData)
 */
async function editMember(memberId, memberDataToUpdate) {
  // TODO: Implement database call to update member data.
  return { error: error.noError, data: "data-here" };
}

/**
 * Deletes a member from the database.
 *
 * @param {number} memberId - The ID of the member to delete.
 * @returns {Object} - A response confirming the deletion or an error message.
 *
 * Note:
 * - We are not actually deleting any member data at this point.
 * - Instead, consider marking the member as inactive or archiving their data.
 */
async function deleteMember(memberId) {
  // TODO: Implement soft delete or archiving logic instead of actual deletion.
}

module.exports = {
  getSpecificMemberData,
  addMember,
  editMember,
  deleteMember,
};
