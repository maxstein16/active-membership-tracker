const Error = require("./public/errors.js");
const error = new Error();
const { sendEmail } = require("../service-layer/emailService");
const { activeMembershipEmail } = require("./public/emailTemplates");

const { getMemberById, getMembersByAttributes, updateMember, createMember } = require("../data-layer/member.js");
const { getOrganizationById } = require("../data-layer/organization.js");
const { getMembershipsByAttributes } = require("../data-layer/membership.js");
const { Member } = require("../db");

/**
 * Retrieves a member by their ID, including their memberships.
 * @param {number} memberId - The unique ID of the member to retrieve.
 * @returns {Promise<object>} The member object if found, otherwise an error.
 */
async function getMemberByIdInDB(memberId) {

    console.log("memberProcessing says getMemberByIdInDB memberID WOUT .data is: " + memberId)


    if (isNaN(memberId)) {
        console.log("memberId is not a number man")
        return { error: error.memberIdMustBeInteger, data: null };
    }

    try {
        const member = await getMemberById(memberId);

        if (!member) {
            return { error: error.memberNotFound, data: null };
        }

        // Get all memberships for this member
        const memberships = await getMembershipsByAttributes({ member_id: memberId });

        // Get organization details for each membership
        const membershipDetails = await Promise.all(
            memberships.map(async (membership) => {
                const org = await getOrganizationById(membership.organization_id);
                return {
                    ...membership.toJSON(),
                    organization: org ? org.toJSON() : null
                };
            })
        );

        const memberData = member.toJSON();
        memberData.memberships = membershipDetails;

        return { error: null, data: memberData };
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
        // Map incoming fields to database fields
        const updateFields = {
            member_personal_email: memberData.personal_email,
            member_phone_number: memberData.phone_number,
            member_gender: memberData.gender,
            member_race: memberData.race,
            member_tshirt_size: memberData.tshirt_size,
            member_major: memberData.major,
            member_graduation_date: memberData.graduation_date,
            member_status: memberData.member_status
        };

        // Remove undefined fields
        Object.keys(updateFields).forEach(
            (key) => updateFields[key] === undefined && delete updateFields[key]
        );

        const updated = await updateMember(memberId, updateFields);
        if (!updated) {
            return { error: error.memberNotFound, data: null };
        }

        // Fetch updated member data
        const updatedMember = await getMemberById(memberId);
        return { error: null, data: updatedMember.toJSON() };
    } catch (err) {
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
        // Map request body to database fields
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

        const newMember = await createMember(mappedFields);
        return { error: null, data: newMember.toJSON() };
    } catch (err) {
        return { error: error.memberCanNotBeAddedToOrg, data: null };
    }
}

async function getMemberIDByUsernameInDB(username) {
    try {
        // Find member by email
        const memberInfo = await Member.findOne({
            where: { member_email: username },
            raw: true,
        });

        // If no member is found, return an error
        if (!memberInfo) {
            return { error: "Member not found", data: null };
        }
        // Return member ID
        return { error: null, data: memberInfo.member_id };
    } catch (err) {
        return { error: "Something went wrong", data: null };
    }
}


/**
 * Retrieves a member's stats within a specific organization.
 * @param {number} memberId - The member's ID.
 * @param {number} orgId - The organization's ID.
 * @returns {Promise<object>} Member's organizational stats or an error.
 */
async function getSpecificMemberOrgStatsInDB(memberId, orgId) {

    if (isNaN(memberId)) {
        return { error: error.memberIdMustBeInteger };
    }
    if (isNaN(orgId)) {
        return { error: error.organizationIdMustBeInteger };
    }

    try {
        const memberships = await getMembershipsByAttributes({
            member_id: memberId,
            organization_id: orgId
        });


        if (!memberships || memberships.length === 0) {
            return { error: error.membershipNotFound };
        }

        const membership = memberships[0];
        const organization = await getOrganizationById(orgId);

        if (!organization) {
            return { error: error.organizationNotFound };
        }

        // Return clean stats object
        return {
            error: null,
            data: {
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
            }
        };
    } catch (err) {
        console.error("Error fetching member organization stats:", err);
        return { error: error.somethingWentWrong };
    }
}

module.exports = {
    getMemberByIdInDB,
    updateMemberInDB,
    createMemberInDB,
    getMemberIDByUsernameInDB,
    getSpecificMemberOrgStatsInDB
};
