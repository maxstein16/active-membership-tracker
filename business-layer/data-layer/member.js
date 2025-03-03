const { Member } = require("../db");

/**
 * Creates a new member in the database.
 *
 * @param {object} memberData - The attributes of the new member
 * @returns {Promise<object>} The newly created member object.
 */
async function createMember(memberData) {
  try {
    const newMember = await Member.create(memberData);
    // console.log("Member created:", newMember.toJSON());
    return newMember;
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
}

/**
 * Updates an existing member by their ID.
 *
 * @param {number} memberId - The unique ID of the member to update.
 * @param {object} updateData - The fields to update
 * @returns {Promise<boolean>} Returns `true` if the member was updated, `false` if no matching member was found.
 */
async function updateMember(memberId, updateData) {
  try {
    const [updatedRows] = await Member.update(updateData, {
      where: { member_id: memberId },
    });

    if (updatedRows > 0) {
      console.log(`Member with ID ${memberId} updated successfully.`);
      return true;
    } else {
      console.log(`No member found with ID ${memberId}.`);
      return false;
    }
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

/**
 * Retrieves all members from the database.
 *
 * @returns {Promise<object[]>} An array of member objects (empty if no members found).
 */
async function getAllMembers() {
  try {
    const members = await Member.findAll();
    if (members.length === 0) {
      console.log("No members found in the database.");
      return [];
    }
    // console.log(
    //   "Members found:",
    //   members.map((m) => m.toJSON())
    // );
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
}

/**
 * Retrieves a specific member by their ID.
 *
 * @param {number} memberId - The unique ID of the member to retrieve.
 * @returns {Promise<object|null>} The member object if found, otherwise `null`.
 */
async function getMemberById(memberId) {
  try {
    const member = await Member.findByPk(memberId);

    if (!member) {
      console.log(`No member found with ID ${memberId}.`);
      return null;
    }

    // console.log("Member found:", member.toJSON());
    return member;
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    throw error;
  }
}

/**
 * Retrieves a specific member by their ID.
 *
 * @param {number} username - The username of the member to retrieve.
 * @returns {Promise<object|null>} The member object if found, otherwise `null`.
 */
async function getMemberByUsername(username) {
  try {
    const member = await Member.findOne({
      where: { member_email: username },
    });

    if (!member) {
      console.log(`No member found with username ${username}.`);
      return null;
    }

    // console.log("Member found:", member.toJSON());
    return member;
  } catch (error) {
    console.error("Error fetching member by username:", error);
    throw error;
  }
}

/**
 * Retrieves members based on provided filters.
 *
 * @param {object} filters - Attributes to filter by
 * @returns {Promise<object[]>} An array of matching member objects (empty if no matches found).
 */
async function getMembersByAttributes(filters) {
  try {
    const members = await Member.findAll({ where: filters });

    if (members.length === 0) {
      console.log("No members found matching the given criteria.");
      return [];
    }

    // console.log(
    //   "Members found:",
    //   members.map((m) => m.toJSON())
    // );
    return members;
  } catch (error) {
    console.error("Error fetching members by attributes:", error);
    throw error;
  }
}

// Export all functions for external use
module.exports = {
  createMember,
  updateMember,
  getAllMembers,
  getMemberById,
  getMemberByUsername,
  getMembersByAttributes,
};
