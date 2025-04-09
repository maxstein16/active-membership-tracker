const Error = require("./public/errors.js");
const error = new Error();

const {
  getMemberById,
  getMembersByAttributes,
} = require("../data-layer/member.js");
const { getOrganizationById } = require("../data-layer/organization.js");
const {
  createMembership,
  editMembership,
  getMembershipsByAttributes,
  getMembershipByAttributes,
} = require("../data-layer/membership.js");
const {
  getCurrentSemester,
  getSemestersByYear,
} = require("../data-layer/semester.js");
const {
  checkActiveMembership,
  calculateActivePercentage,
} = require("./organizationMembershipProcessing.js");
const { ROLE_ADMIN } = require("../constants");

async function getSpecificMemberWithOrgDataInDB(orgId, memberId) {
  try {
    if (isNaN(orgId))
      return { error: error.organizationIdMustBeInteger, data: null };
    if (isNaN(memberId))
      return { error: error.memberIdMustBeInteger, data: null };

    const member = await getMemberById(memberId);
    if (!member) return { error: error.memberNotFound, data: null };

    const memberships = await getMembershipsByAttributes({
      member_id: memberId,
      organization_id: orgId,
    });

    if (!memberships || memberships.length === 0)
      return { error: error.memberNotFoundInOrg, data: null };

    // Count active semesters
    const activeSemestersCount = memberships.filter(
      (m) => m.active_member
    ).length;

    // Get current semester
    const currentSemester = await getCurrentSemester();

    const currentMembership = memberships.find(
      (m) => m.semester_id === currentSemester.semester_id
    );

    // Active percentage + attendance (if needed)
    const percentageResult = await calculateActivePercentage(
      currentMembership || memberships[0]
    );

    return {
      error: error.noError,
      data: {
        ...member.toJSON(),
        membership: currentMembership || memberships[0],
        active_percentage: percentageResult.percentage,
        remaining_attendance: percentageResult.remainingAttendance,
        activeSemesters: activeSemestersCount,
      },
    };
  } catch (err) {
    console.error("Error fetching specific member + membership:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function addMemberToAnOrganizationInDB(orgId, memberData) {
  try {
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberData.member_id)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }
    if (isNaN(memberData.membership_role)) {
      return { error: error.roleMustBeAnInteger, data: null };
    }

    // Verify organization exists
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.orgNotFound, data: null };
    }

    // Verify member exists
    const member = await getMemberById(memberData.member_id);
    if (!member) {
      return { error: error.memberNotFound, data: null };
    }

    // Get current semester
    const currentSemester = await getCurrentSemester();

    const membership = await createMembership({
      ...memberData,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!membership) {
      return { error: error.couldNotCreateMembership, data: null };
    }

    return {
      error: error.noError,
      data: membership,
    };
  } catch (err) {
    console.error("Error adding specific member to organization:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function editMemberInOrganizationInDB(
  orgId,
  memberId,
  memberDataToUpdate
) {
  try {
    if (memberDataToUpdate.hasOwnProperty("role")) {
      memberDataToUpdate.membership_role = memberDataToUpdate.role;
      delete memberDataToUpdate.role;
    }
    if (isNaN(orgId))
      return { error: error.organizationIdMustBeInteger, data: null };
    if (isNaN(memberId))
      return { error: error.memberIdMustBeInteger, data: null };
    if (
      memberDataToUpdate.hasOwnProperty("membership_role") &&
      isNaN(memberDataToUpdate.membership_role)
    ) {
      return { error: error.roleMustBeAnInteger, data: null };
    }
    if (
      memberDataToUpdate.hasOwnProperty("membership_points") &&
      isNaN(memberDataToUpdate.membership_points)
    ) {
      return { error: error.memberPointsNaN, data: null };
    }

    const currentSemester = await getCurrentSemester();

    const membership = await getMembershipByAttributes({
      member_id: memberId,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    // console.log("Editing membership: ", membership);

    if (!membership) return { error: error.membershipNotFound, data: null };

    if (memberDataToUpdate.hasOwnProperty("membership_role")) {
      const currentRole = membership.membership_role;
      const newRole = memberDataToUpdate.membership_role;
      if (currentRole === ROLE_ADMIN && newRole !== ROLE_ADMIN) {
        const adminMembers = await getMembershipsByAttributes({
          organization_id: orgId,
          membership_role: ROLE_ADMIN,
        });
        if (adminMembers.length === 1) {
          return { error: error.cannotRemoveLastAdmin, data: null };
        }
      }
    }

    const updated = await editMembership(
      membership.membership_id,
      memberDataToUpdate
    );
    if (!updated) return { error: error.membershipNotFound, data: null };

    if (memberDataToUpdate.hasOwnProperty("membership_points")) {
      await membership.reload(); // Make sure membership has latest data
      checkActiveMembership(membership);
    }

    return { error: error.noError, data: { update: "success" } };
  } catch (err) {
    console.error("Error editing membership:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function deleteMemberInOrganizationInDB(orgId, memberId) {
  try {
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberId)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }

    const currentSemester = await getCurrentSemester();

    const memberships = await getMembershipByAttributes({
      member_id: memberId,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!memberships || memberships.length === 0) {
      return { error: error.membershipNotFound, data: null };
    }

    const membership = memberships[0];
    await membership.destroy();

    return {
      error: error.noError,
      data: { message: "Membership Successfully Deleted" },
    };
  } catch (err) {
    console.error("Error deleting membership:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function getMembersInOrganizationInDB(orgId) {
  try {
    if (isNaN(orgId))
      return { error: error.organizationIdMustBeInteger, data: null };

    const currentSemester = await getCurrentSemester();

    const members = await getMembersByAttributes({});
    const memberships = await getMembershipsByAttributes({
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!members || !memberships)
      return { error: error.membershipNotFound, data: null };

    const resultData = memberships
      .map((membership) => {
        const memberData = members.data.find(
          (member) => member.member_id === membership.member_id
        );
        if (!memberData) return null;
        return {
          ...membership.toJSON(),
          member_name: memberData.member_name,
          member_email: memberData.member_email,
          member_major: memberData.member_major,
          member_graduation_date: memberData.member_graduation_date,
        };
      })
      .filter((data) => data !== null);

    return { error: error.noError, data: resultData };
  } catch (err) {
    console.error("Error fetching all members of org:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

module.exports = {
  getSpecificMemberWithOrgDataInDB,
  addMemberToAnOrganizationInDB,
  editMemberInOrganizationInDB,
  deleteMemberInOrganizationInDB,
  getMembersInOrganizationInDB,
  getMembersByAttributes,
};
