const {
  getMemberAttendanceForEventType,
} = require("../data-layer/attendance.js");
const { getEventsByAttributes } = require("../data-layer/event.js");
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
    const { organization_id, membership_points, member_id, semester_id } =
      membership;

    const organization = await getOrganizationById(organization_id);
    const membershipRequirements = await getOrganizationMembershipRequirements(
      organization_id
    );

    if (!organization || !membershipRequirements.length) {
      console.error("Organization or membership requirements not found.");
      return { percentage: 0, success: false, remainingAttendance: [] };
    }

    let percentage = 0;
    let remainingAttendance = [];

    // ===== POINTS-BASED ORG =====
    if (organization.organization_membership_type === "points") {
      const requiredPoints = organization.organization_threshold;
      percentage = (membership_points / requiredPoints) * 100;
      percentage = Math.min(percentage, 100); // Cap at 100%
    }

    // ===== ATTENDANCE-BASED ORG =====
    else if (organization.organization_membership_type === "attendance") {
      let fulfilledRequirements = 0;

      for (const requirement of membershipRequirements) {
        const { event_type, requirement_type, requirement_value } = requirement;

        const attendanceRecords = await getMemberAttendanceForEventType(
          member_id,
          organization_id,
          event_type
        );

        const attendanceCount = attendanceRecords.length;

        let requirementFulfilled = false;
        let requirementPercentage = 0;

        let attendancePercentage = null;
        let remainingPercentage = null;
        let totalEvents = null;
        let remaining = null;

        // === attendance_count requirement ===
        if (requirement_type === "attendance_count") {
          requirementPercentage = (attendanceCount / requirement_value) * 100;
        
          if (attendanceCount >= requirement_value) {
            fulfilledRequirements++;
            requirementFulfilled = true;
            requirementPercentage = 100;
          }
        
          remaining = Math.max(0, requirement_value - attendanceCount);
        
          attendancePercentage = requirementPercentage;
          remainingPercentage = Math.max(0, 100 - attendancePercentage);
          totalEvents = requirement_value;
        }

        // === percentage requirement ===
        else if (requirement_type === "percentage") {
          const events = await getEventsByAttributes({
            organization_id: organization.organization_id,
            event_type: requirement.event_type,
            semester_id: semester_id,
          });

          totalEvents = events.length;
          attendancePercentage =
            totalEvents > 0 ? (attendanceCount / totalEvents) * 100 : 0;

          requirementPercentage = attendancePercentage;
          if (attendancePercentage >= requirement_value) {
            fulfilledRequirements++;
            requirementFulfilled = true;
            requirementPercentage = 100;
          }

          remainingPercentage = Math.max(
            0,
            requirement_value - attendancePercentage
          );
        }

        remainingAttendance.push({
          event_type,
          requirement_type,
          required: requirement_value,
          attended: attendanceCount || 0,
          remaining,
          attendancePercentage:
            attendancePercentage !== null
              ? Math.round(attendancePercentage)
              : null,
          requiredPercentage:
            requirement_type === "percentage" ? requirement_value : null,
          remainingPercentage:
            remainingPercentage !== null
              ? Math.round(remainingPercentage)
              : null,
          totalEvents,
          fulfilled: requirementFulfilled,
          requirementPercentage: Math.min(
            Math.round(requirementPercentage),
            100
          ),
        });
      }

      // Master percentage based on requirements fulfilled
      percentage =
        (fulfilledRequirements / membershipRequirements.length) * 100;
    }
    return {
      percentage: Math.round(percentage),
      success: true,
      remainingAttendance,
    };
  } catch (error) {
    console.error("Error calculating active percentage:", error);
    return { percentage: 0, success: false, remainingAttendance: [] };
  }
}

async function checkActiveMembership(membership) {
  try {
    const { percentage, success } = await calculateActivePercentage(membership);
    if (percentage >= 100) {
      membership.active_member = true;
      await membership.save();
      const organization = await getOrganizationById(membership.organization_id);
      await sendActiveMembershipEmail(membership, organization);
      return true;
    } else {
      membership.active_member = false;
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
