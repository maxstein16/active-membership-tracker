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
const { getCurrentSemester } = require("../data-layer/semester.js");
const {
  checkActiveMembership,
  calculateActivePercentage,
} = require("./organizationMembershipProcessing.js");
const { ROLE_ADMIN } = require("../constants"); // Import the constant

async function getSpecificMemberWithOrgDataInDB(orgId, memberId) {
  try {
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberId)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }

    // Get member data
    const member = await getMemberById(memberId);
    if (!member) {
      return { error: error.memberNotFound, data: null };
    }

    const currentSemester = await getCurrentSemester();

    // Get membership data
    const memberships = await getMembershipsByAttributes({
      member_id: memberId,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!memberships || memberships.length === 0) {
      return { error: error.memberNotFoundInOrg, data: null };
    }

    const percentageResult = await calculateActivePercentage(memberships[0]);

    return {
      error: error.noError,
      data: {
        ...member.toJSON(),
        membership: memberships[0],
        active_percentage: percentageResult.percentage,
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
    // Normalize role field early if present
    if (memberDataToUpdate.role !== undefined) {
      memberDataToUpdate.membership_role = memberDataToUpdate.role;
      delete memberDataToUpdate.role;
    }

    // ID & input validation
    if (isNaN(orgId))
      return { error: error.organizationIdMustBeInteger, data: null };
    if (isNaN(memberId))
      return { error: error.memberIdMustBeInteger, data: null };
    if (
      memberDataToUpdate.membership_role !== undefined &&
      isNaN(memberDataToUpdate.membership_role)
    ) {
      return { error: error.roleMustBeAnInteger, data: null };
    }
    if (
      memberDataToUpdate.membership_points !== undefined &&
      isNaN(memberDataToUpdate.membership_points)
    ) {
      return { error: error.memberPointsNaN, data: null };
    }

    // Get current semester & membership
    const currentSemester = await getCurrentSemester();
    const memberships = await getMembershipsByAttributes({
      member_id: memberId,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!memberships || memberships.length === 0) {
      return { error: error.membershipNotFound, data: null };
    }
    const membership = memberships[0];

    // Admin removal check
    if (memberDataToUpdate.membership_role !== undefined) {
      if (
        membership.membership_role === ROLE_ADMIN &&
        memberDataToUpdate.membership_role !== ROLE_ADMIN
      ) {
        const adminMembers = await getMembershipsByAttributes({
          organization_id: orgId,
          membership_role: ROLE_ADMIN,
        });
        if (adminMembers.length === 1) {
          return { error: error.cannotRemoveLastAdmin, data: null };
        }
      }
    }

    // Update membership
    const updated = await editMembership(
      membership.membership_id,
      memberDataToUpdate
    );

    if (!updated) return { error: error.membershipNotFound, data: null };

    // Active membership check (if points updated)
    if (memberDataToUpdate.membership_points !== undefined) {
      const organization = await getOrganizationById(orgId);
      if (!organization)
        return { error: error.organizationNotFound, data: null };
      
      await membership.reload();
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
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }

    const currentSemester = await getCurrentSemester();

    // Get all members and memberships for this organization
    const membersResult = await getMembersByAttributes({});
    const members = membersResult.data || [];

    const memberships = await getMembershipsByAttributes({
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!members || !memberships) {
      return { error: error.membershipNotFound, data: null };
    }

    // Combine member and membership data
    const resultData = memberships
      .map((membership) => {
        const memberData = members.find(
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

    return {
      error: error.noError,
      data: resultData,
    };
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
};
