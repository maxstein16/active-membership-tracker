const { Member, Membership, Organization } = require("../db"); // Import database models
const { sendEmail } = require("../service-layer/emailService");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieves a member by their ID, including their memberships.
 * @param {number} memberId - The unique ID of the member to retrieve.
 * @returns {Promise<object>} The member object if found, otherwise an error.
 */
async function getMemberById(memberId) {
    if (!Number.isInteger(memberId)) {
        return { error: error.memberIdMustBeInteger, data: null };
    }

    try {
        const member = await Member.findByPk(memberId, {
            include: [
                {
                    model: Membership,
                    include: [{ model: Organization }],
                },
            ],
        });

        if (!member) {
            return { error: error.memberNotFound, data: null };
        }

        return { error: error.noError, data: member.toJSON() };
    } catch (err) {
        console.error("Error fetching member by ID:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Updates an existing member in the database.
 * @param {number} memberId - The ID of the member to update.
 * @param {object} memberData - The new data for the member.
 * @returns {Promise<object>} The updated member object or an error.
 */
async function updateMemberInDB(memberId, memberData) {
    if (!Number.isInteger(memberId)) {
        return { error: error.memberIdMustBeInteger, data: null };
    }
    if (typeof memberData !== "object" || Object.keys(memberData).length === 0) {
        return { error: error.mustIncludeValidFieldAddMember, data: null };
    }

    try {
        // fetch member's existing status before updating
        const prevMemberStats = await getSpecificMemberOrgStats(memberId, memberData.organization_id);
        const wasActiveBefore = prevMemberStats.data?.isActiveMember || false;

        // update the member's data
        const [updated] = await Member.update(memberData, { where: { member_id: memberId } });

        if (!updated) {
            return { error: error.memberNotFound, data: null };
        }

        // fetch updated member status
        const updatedMember = await Member.findByPk(memberId);
        const newMemberStats = await getSpecificMemberOrgStats(memberId, memberData.organization_id);
        const isActiveNow = newMemberStats.data?.isActiveMember || false;

        // if the member just became active, send an email
        if (!wasActiveBefore && isActiveNow) {
            await sendEmail(
                updatedMember.email,
                "Congratulations! You're Now an Active Member",
                `<p>Dear ${updatedMember.name},</p><p>You are now an active member of ${newMemberStats.data.organization_name}! Keep up the great work!</p>`
            );
        }

        return { error: error.noError, data: updatedMember.toJSON() };
    } catch (err) {
        console.error("Error updating member:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Creates a new member in the database.
 * @param {object} memberData - The attributes of the new member.
 * @returns {Promise<object>} The newly created member object or an error.
 */
async function createMemberInDB(memberData) {
    if (typeof memberData !== "object") {
        return { error: error.mustHaveAllFieldsAddMemberInOrg, data: null };
    }

    try {
        const newMember = await Member.create(memberData);
        return { error: error.noError, data: newMember.toJSON() };
    } catch (err) {
        console.error("Error creating member:", err);
        return { error: error.memberCanNotBeAddedToOrg, data: null };
    }
}

/**
 * Retrieves a member's stats within a specific organization.
 * @param {number} memberId - The member's ID.
 * @param {number} orgId - The organization's ID.
 * @returns {Promise<object>} Member's organizational stats or an error.
 */
async function getSpecificMemberOrgStats(memberId, orgId) {
    if (!Number.isInteger(memberId)) {
        return { error: error.memberIdMustBeInteger, data: null };
    }
    if (!Number.isInteger(orgId)) {
        return { error: error.organizationIdMustBeInteger, data: null };
    }

    try {
        const membership = await Membership.findOne({
            where: { member_id: memberId, organization_id: orgId },
            include: [{ model: Organization }],
        });

        if (!membership) {
            return { error: error.membershipNotFound, data: null };
        }

        const stats = {
            member_id: membership.member_id,
            organization_id: membership.organization_id,
            membership_id: membership.membership_id,
            organization_name: membership.Organization.organization_name,
            organization_abbreviation: membership.Organization.organization_abbreviation,
            meetings_attended: membership.meetings_attended || 0,
            volunteer_events: membership.volunteer_events || 0,
            social_events: membership.social_events || 0,
            your_points: membership.points || 0,
            active_membership_threshold: Organization.active_membership_threshold,
            isActiveMember: (membership.points || 0) >= 48,
        };

        return { error: error.noError, data: stats };
    } catch (err) {
        console.error("Error fetching member organization stats:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

module.exports = {
    getMemberById,
    updateMemberInDB,
    createMemberInDB,
    getSpecificMemberOrgStats
};
