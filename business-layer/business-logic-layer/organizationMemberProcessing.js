const { Member, Membership, Organization } = require("../db.js");
const Error = require("./public/errors.js");
const error = new Error();

async function getSpecificMemberWithOrgData(orgId, memberId) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberId)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }

    // get the data from data-layer
    const member = await Member.findOne({ where: { member_id: memberId } });

    // if the result is empty return error
    if (!member) {
      return { error: error.memberNotFound, data: null };
    }

    // get membership from database
    const membership = await Membership.findOne({
      where: { organization_id: orgId, member_id: memberId },
    });

    // if it doesn't exist return error
    if (!membership) {
      return { error: error.memberNotFoundInOrg, data: null };
    }

    return {
      error: error.noError,
      data: { ...member, membership: membership },
    };
  } catch (err) {
    console.error("Error fetching specific member + membership:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function addMemberToAnOrganization(orgId, memberData) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberData.member_id)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }
    if (isNaN(memberData.role)) {
      return { error: error.roleMustBeAnInteger, data: null };
    }

    // does org exist?
    const organization = await Organization.findOne({
      where: { organization_id: orgId },
    });
    if (!organization) {
      return { error: error.orgNotFound, data: null };
    }

    // get the data from data-layer
    const membership = await Membership.create({
      ...memberData,
      organization_id: orgId,
    });

    // if the result is empty return error
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

async function editMemberInOrganization(orgId, memberId, memberDataToUpdate) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberId)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }
    if (isNaN(memberDataToUpdate.role)) {
      return { error: error.roleMustBeAnInteger, data: null };
    }

    // get the data from data-layer
    const [updatedRows] = await Membership.update(memberDataToUpdate, {
      where: {
        organization_id: orgId,
        member_id: memberId,
      },
    });

    // if the result is empty return error
    if (updatedRows == 0) {
      return { error: error.membershipNotFound, data: null };
    }

    return {
      error: error.noError,
      data: { update: "success" },
    };
  } catch (err) {
    console.error("Error editing membership:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function deleteMemberInOrganization(orgId, memberId) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(memberId)) {
      return { error: error.memberIdMustBeInteger, data: null };
    }

    // get the data from data-layer
    await Membership.destroy({
      where: {
        organization_id: orgId,
        member_id: memberId,
      },
    });

    return {
      error: error.noError,
      data: { message: "Membership Successfully Deleted" },
    };
  } catch (err) {
    console.error("Error deleting membership:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function getMembershipRoleInfoInOrganization(orgId, role) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }
    if (isNaN(role)) {
      return { error: error.roleMustBeAnInteger, data: null };
    }

    // get the data from data-layer
    const memberships = await Membership.findAll();

    // if the result is empty return error
    if (!memberships || memberships.length < 1) {
      return { error: error.membershipNotFound, data: null };
    }

    // filter by org and role
    const filteredMemberships = memberships.filter(
      (membership) =>
        membership.organization_id == orgId && membership.role == role
    );

    // check if there are results
    if (filteredMemberships.length < 1) {
      return { error: error.membershipNotFound, data: null };
    }

    let displayResults = filteredMemberships.map(
      (membership_id, member_id) => ({ membership_id, member_ids })
    );

    return {
      error: error.noError,
      data: {
        organization_id: orgId,
        role: role,
        memberships: displayResults,
      },
    };
  } catch (err) {
    console.error("Error getting memberships by role:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function getMembersInOrganization(orgId) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }

    // get the data from data-layer
    const members = await Member.findAll();
    const memberships = await Membership.findAll();

    // if the result is empty return error
    if (!members || !memberships) {
      return { error: error.membershipNotFound, data: null };
    }

    // filter for memberships only in this org
    const membershipsInOrg = memberships.filter(
      (membership) => membership.organization_id == orgId
    );

    // put some of the member data into an array with the membership information
    const resultData = membershipsInOrg.map((membership) => {
      let memberData = members.find(
        (member) => member.member_id == membership.member_id
      );
      if (!memberData) {
        return;
      }
      return {
        ...membership,
        member_name: memberData.member_name,
        member_email: memberData.member_email,
        member_major: memberData.member_major,
        member_graduation_date: memberData.member_graduation_date,
      };
    });

    return {
      error: error.noError,
      data: resultData,
    };
  } catch (err) {
    console.error("Error fetching all members of org", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

module.exports = {
  getSpecificMemberWithOrgData,
  addMemberToAnOrganization,
  editMemberInOrganization,
  deleteMemberInOrganization,
  getMembershipRoleInfoInOrganization,
  getMembersInOrganization,
};
