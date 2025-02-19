const { Member, Membership, Organization } = require("../db");
const { sendEmail } = require("../service-layer/emailService");
const { activeMembershipEmail } = require("./public/emailTemplates");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieves a member by their ID, including their memberships.
 * @param {number} memberId - The unique ID of the member to retrieve.
 * @returns {Promise<object>} The member object if found, otherwise an error.
 */
async function getMemberById(memberId) {
    if (isNaN(memberId)) {
        return { error: error.memberIdMustBeInteger, data: null };
    }

    try {
        const member = await Member.findByPk(memberId, {
            include: [
                {
                    model: Membership,
                    as: 'memberships',
                    include: [
                        {
                            model: Organization,
                            as: 'organization'
                        }
                    ],
                },
            ],
        }); 

        if (!member) {
            return { error: error.memberNotFound, data: null };
        }

        return { error: null, data: member.toJSON() };
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
    if (isNaN(memberId)) {
        return { error: error.memberIdMustBeInteger, data: null };
    }
    if (!memberData || typeof memberData !== "object" || Object.keys(memberData).length === 0) {
        return { error: error.mustIncludeValidFieldAddMember, data: null };
    }

    try {
        const existingMember = await Member.findByPk(memberId);
        if (!existingMember) {
            return { error: error.memberNotFound, data: null };
        }

        // 🔑 Map incoming fields to database fields
        const updateFields = {
            member_personal_email: memberData.personal_email,
            member_phone_number: memberData.phone_number,
            member_gender: memberData.gender,
            member_race: memberData.race,
            member_tshirt_size: memberData.tshirt_size,
            member_major: memberData.major,
            member_graduation_date: memberData.graduation_date,
        };

        // Remove undefined fields to avoid Sequelize errors
        Object.keys(updateFields).forEach(
            (key) => updateFields[key] === undefined && delete updateFields[key]
        );

        // Perform the update
        await Member.update(updateFields, { where: { member_id: memberId } });

        // Fetch updated member data
        const updatedMember = await Member.findByPk(memberId);

        return { error: null, data: updatedMember.toJSON() };
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
    if (!memberData || typeof memberData !== "object") {
        return { error: error.mustHaveAllFieldsAddMemberInOrg, data: null };
    }

    try {
        // Map request body to Sequelize fields
        const mappedFields = {
            member_name: memberData.name,
            member_email: memberData.email,
            member_personal_email: memberData.personal_email,
            member_phone_number: memberData.phone_number,
            member_graduation_date: memberData.graduation_date,
            member_tshirt_size: memberData.tshirt_size,
            member_major: memberData.major,
            member_gender: memberData.gender,
            member_race: memberData.race,
            member_status: memberData.status || "undergraduate", // default status
        };

        // Remove undefined fields
        Object.keys(mappedFields).forEach(
            (key) => mappedFields[key] === undefined && delete mappedFields[key]
        );

        // Create the member in the database
        const newMember = await Member.create(mappedFields);
        return { error: null, data: newMember.toJSON() };
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
    if (isNaN(memberId)) {
        return { error: error.memberIdMustBeInteger };
    }
    if (isNaN(orgId)) {
        return { error: error.organizationIdMustBeInteger };
    }

    try {
        const membership = await Membership.findOne({
            where: { 
                member_id: memberId, 
                organization_id: orgId 
            },
            include: [
                { 
                    model: Organization,
                    as: 'organization'
                }
            ]
        });

        if (!membership) {
            return { error: error.membershipNotFound };
        }

        const organization = membership.organization;
        if (!organization) {
            return { error: error.organizationNotFound };
        }

        // Return clean stats object directly
        return {
            member_id: membership.member_id,
            organization_id: membership.organization_id,
            membership_id: membership.membership_id,
            organization_name: organization.organization_name,
            organization_abbreviation: organization.organization_abbreviation,
            meetings_attended: membership.meetings_attended || 0,
            volunteer_events: membership.volunteer_events || 0,
            social_events: membership.social_events || 0,
            your_points: membership.membership_points || 0,
            organization_threshold: organization.organization_threshold,
            isActiveMember: (membership.membership_points || 0) >= organization.organization_threshold
        };
    } catch (err) {
        console.error("Error fetching member organization stats:", err);
        return { error: error.somethingWentWrong };
    }
}

module.exports = {
    getMemberById,
    updateMemberInDB,
    createMemberInDB,
    getSpecificMemberOrgStats
};
