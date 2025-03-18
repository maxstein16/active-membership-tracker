const {
  getMemberAttendanceForEventType,
} = require("../data-layer/attendance.js");
const {
  getMembershipsByAttributes,
  getMembershipByAttributes,
} = require("../data-layer/membership.js");
const {
  getOrganizationById,
  getOrganizationMembershipRequirements,
} = require("../data-layer/organization.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieve membership role information for a specific organization in a semester
 * @param {number} organizationId - The ID of the organization
 * @param {number} role - The role ID to filter by
 * @param {number} semesterId - The semester ID to filter by
 * @returns {Promise<Object>} Membership details
 */
async function getMembershipRoleInfoInOrganizationInDB(
  organizationId,
  role,
  semesterId
) {
  try {
    if (isNaN(organizationId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(role)) {
      return { error: error.roleMustBeAnInteger, data: null };
    }
    if (isNaN(semesterId)) {
      return { error: error.semesterIdMustBeInteger, data: null };
    }

    const memberships = await getMembershipsByAttributes({
      organization_id: organizationId,
      membership_role: role,
      semester_id: semesterId,
    });

    if (!memberships || memberships.length < 1) {
      return { error: error.membershipNotFound, data: null };
    }

    return {
      error: error.noError,
      data: memberships.map((membership) => membership.toJSON()),
    };
  } catch (err) {
    console.error("Error fetching membership role info:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Retrieve all members in a specific organization for a given semester
 * @param {number} organizationId - The ID of the organization
 * @param {number} semesterId - The semester ID to filter by
 * @returns {Promise<Object>} List of members in the organization
 */
async function getAllMembershipsInOrganizationInDB(organizationId, semesterId) {
  try {
    if (isNaN(organizationId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(semesterId)) {
      return { error: error.semesterIdMustBeInteger, data: null };
    }

    const memberships = await getMembershipsByAttributes({
      organization_id: organizationId,
      semester_id: semesterId,
    });

    if (!memberships) {
      return { error: error.membershipNotFound, data: null };
    }

    return {
      error: error.noError,
      data: memberships.map((membership) => membership.toJSON()),
    };
  } catch (err) {
    console.error("Error fetching members in organization:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Get members across multiple semesters for an organization
 * @param {number} organizationId - The ID of the organization
 * @param {number[]} semesterIds - Array of semester IDs to query
 * @returns {Promise<Object>} Members grouped by semester
 */
async function getMembershipsAcrossSemesters(organizationId, semesterIds) {
  try {
    if (isNaN(organizationId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (!Array.isArray(semesterIds) || semesterIds.some((id) => isNaN(id))) {
      return { error: error.invalidSemesterIds, data: null };
    }

    const membershipsBySemester = {};

    for (const semesterId of semesterIds) {
      const memberships = await getMembershipByAttributes({
        organization_id: organizationId,
        semester_id: semesterId,
      });

      membershipsBySemester[semesterId] = memberships
        ? memberships.map((membership) => membership.toJSON())
        : [];
    }

    return {
      error: error.noError,
      data: membershipsBySemester,
    };
  } catch (err) {
    console.error("Error fetching memberships across semesters:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Check and update active membership status for a member.
 * @param {Object} membership - The membership object (includes member_id, organization_id, points, etc.).
 * @returns {boolean} - Returns `true` if the member became active, `false` otherwise.
 */
async function checkActiveMembership(membership) {
  try {
    const { organization_id, membership_points, member_id } = membership;

    // Retrieve organization and membership requirements
    const organization = getOrganizationById(organization_id);
    const membershipRequirements =
      getOrganizationMembershipRequirements(organization_id);

    if (!organization || !membershipRequirements.length) {
      console.error("Organization or membership requirements not found.");
      return false;
    }

    let isActive = false;

    // Check if the organization is **points-based**
    if (organization.organization_membership_type === "points") {
      const requiredPoints = organization.organization_threshold;
      if (membership_points >= requiredPoints) {
        isActive = true;
      }
    }
    // Check if the organization is **attendance-based**
    else if (organization.organization_membership_type === "attendance") {
      isActive = checkAttendanceBasedMembership(
        member_id,
        organization_id,
        membershipRequirements
      );
    }

    if (isActive) {
      membership.active_member = true; // Mark as active
      await membership.save(); // Save changes to DB
      await sendActiveMembershipEmail(membership, organization); // Notify member via email
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking active membership:", error);
    return false;
  }
}

/**
 * Check if a member has met attendance-based membership requirements.
 * @param {number} member_id - The member's ID.
 * @param {number} organization_id - The organization's ID.
 * @param {Array} membershipRequirements - The organization's membership requirements.
 * @returns {boolean} - Returns `true` if all requirements are met, otherwise `false`.
 */
async function checkAttendanceBasedMembership(
  member_id,
  organization_id,
  membershipRequirements
) {
  try {
    for (const requirement of membershipRequirements) {
      const { event_type, requirement_type, requirement_value } = requirement;

      // Get the number of attended events for this event type
      const attendanceCount = await getMemberAttendanceForEventType(
        member_id,
        organization_id,
        event_type
      );

      // Check if the member has met the requirement
      if (
        requirement_type === "attendance_count" &&
        attendanceCount < requirement_value
      ) {
        return false; // If any requirement isn't met, member isn't active
      }
    }

    return true; // If all requirements are met, member is active
  } catch (error) {
    console.error("Error in checkAttendanceBasedMembership:", error);
    return false;
  }
}

module.exports = {
  getMembershipRoleInfoInOrganizationInDB,
  getAllMembershipsInOrganizationInDB,
  getMembershipsAcrossSemesters,
  checkActiveMembership,
  checkAttendanceBasedMembership,
};
