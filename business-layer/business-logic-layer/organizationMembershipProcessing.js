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

async function calculateActivePercentage(membership) {
  try {
    const { organization_id, membership_points, member_id } = membership;

    const organization = await getOrganizationById(organization_id);
    const membershipRequirements = await getOrganizationMembershipRequirements(organization_id);

    if (!organization || !membershipRequirements.length) {
      console.error("Organization or membership requirements not found.");
      return { percentage: 0, success: false };
    }

    let percentage = 0;

    // Points-based calculation
    if (organization.organization_membership_type === "points") {
      const requiredPoints = organization.organization_threshold;
      percentage = (membership_points / requiredPoints) * 100;
      percentage = Math.min(percentage, 100); // Cap at 100%
    } 
    // Attendance-based calculation
    else if (organization.organization_membership_type === "attendance") {
      let totalRequirements = membershipRequirements.length;
      let fulfilledRequirements = 0;

      for (const requirement of membershipRequirements) {
        const { event_type, requirement_type, requirement_value } = requirement;

        const attendanceCount = await getMemberAttendanceForEventType(
          member_id,
          organization_id,
          event_type
        );

        if (requirement_type === "attendance_count") {
          if (attendanceCount >= requirement_value) {
            fulfilledRequirements++;
          }
        }
      }

      percentage = (fulfilledRequirements / totalRequirements) * 100;
    }

    return { percentage: Math.round(percentage), success: true };
  } catch (error) {
    console.error("Error calculating active percentage:", error);
    return { percentage: 0, success: false };
  }
}

async function checkActiveMembership(membership) {
  try {
    const { percentage, success } = await calculateActivePercentage(membership);

    if (!success) {
      return false;
    }

    if (percentage >= 100) {
      membership.active_member = true; // Mark as active
      await membership.save();
      const organization = await getOrganizationById(membership.organization_id);
      await sendActiveMembershipEmail(membership, organization);
      return true;
    }
    else {
      membership.active_member = false; // Mark as active
      await membership.save();
    }

    return false;
  } catch (error) {
    console.error("Error checking active membership:", error);
    return false;
  }
}

module.exports = {
  getMembershipRoleInfoInOrganizationInDB,
  getAllMembershipsInOrganizationInDB,
  getMembershipsAcrossSemesters,
  checkActiveMembership,
  calculateActivePercentage,
};
