const { getMembershipsByAttributes, getMembershipByAttributes } = require("../data-layer/membership.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Retrieve membership role information for a specific organization in a semester
 * @param {number} organizationId - The ID of the organization
 * @param {number} role - The role ID to filter by
 * @param {number} semesterId - The semester ID to filter by
 * @returns {Promise<Object>} Membership details
 */
async function getMembershipRoleInfoInOrganizationInDB(organizationId, role, semesterId) {
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

        const memberships = await getMembershipByAttributes({ 
            organization_id: organizationId,
            membership_role: role,
            semester_id: semesterId 
        });

        if (!memberships || memberships.length < 1) {
            return { error: error.membershipNotFound, data: null };
        }

        return { 
            error: error.noError, 
            data: memberships.map(membership => membership.toJSON())
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
            semester_id: semesterId
        });

        if (!memberships) {
            return { error: error.membershipNotFound, data: null };
        }

        return { 
            error: error.noError, 
            data: memberships.map(membership => membership.toJSON())
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
        if (!Array.isArray(semesterIds) || semesterIds.some(id => isNaN(id))) {
            return { error: error.invalidSemesterIds, data: null };
        }

        const membershipsBySemester = {};
        
        for (const semesterId of semesterIds) {
            const memberships = await getMembershipByAttributes({
                organization_id: organizationId,
                semester_id: semesterId
            });
            
            membershipsBySemester[semesterId] = memberships ? 
                memberships.map(membership => membership.toJSON()) : 
                [];
        }

        return {
            error: error.noError,
            data: membershipsBySemester
        };
    } catch (err) {
        console.error("Error fetching memberships across semesters:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

module.exports = {
    getMembershipRoleInfoInOrganizationInDB,
    getAllMembershipsInOrganizationInDB,
    getMembershipsAcrossSemesters
};