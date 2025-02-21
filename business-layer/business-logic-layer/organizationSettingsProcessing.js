const { Organization, MembershipRequirement, EmailSettings } = require("../db");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Get organization settings by ID
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} Organization settings
 */
const getOrganizationSettings = async (orgId) => {
    try {
        const organization = await Organization.findByPk(orgId, {
            include: [
                {
                    model: MembershipRequirement,
                    attributes: ["requirement_id", "organization_id", "meeting_type", "frequency", "amount_type", "amount", "requirement_scope"],
                },
                {
                    model: EmailSettings,
                    attributes: ["current_status", "organization_id", "annual_report", "semester_report", "membership_achieved"],
                }
            ]
        });

        if (!organization) {
            return { error: error.organizationNotFound, data: null };
        }

        return { error: error.noError, data: organization };
    } catch (err) {
        console.error("Error fetching organization settings:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

/**
 * Edit organization membership requirements
 * @param {number} orgId - The ID of the organization
 * @param {object} orgData - Updated membership requirements data
 * @returns {Promise<Object>} Updated membership requirements
 */
const editOrganizationMembershipRequirements = async (orgId, orgData) => {
    try {
        const [updatedRows] = await MembershipRequirement.update(orgData, {
            where: { organization_id: orgId, requirement_id: orgData.requirement_id }
        });

        if (updatedRows === 0) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: orgData };
    } catch (err) {
        console.error("Error updating membership requirements:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

/**
 * Edit organization email settings
 * @param {number} orgId - The ID of the organization
 * @param {object} orgData - Updated email settings
 * @returns {Promise<Object>} Updated email settings
 */
const editOrganizationEmailSettings = async (orgId, orgData) => {
    try {
        const [updatedRows] = await EmailSettings.update(orgData, {
            where: { organization_id: orgId }
        });

        if (updatedRows === 0) {
            return { error: error.organizationNotFound, data: null };
        }

        return { error: error.noError, data: orgData };
    } catch (err) {
        console.error("Error updating email settings:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

/**
 * Delete an organization's membership requirement
 * @param {number} orgId - The ID of the organization
 * @param {number} membershipId - The ID of the membership requirement
 * @returns {Promise<Object>} Deletion status
 */
const deleteOrganizationMembershipRequirement = async (orgId, membershipId) => {
    try {
        const deletedRows = await MembershipRequirement.destroy({
            where: { organization_id: orgId, requirement_id: requirementId }
        });

        if (deletedRows === 0) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: { deleted: true } };
    } catch (err) {
        console.error("Error deleting membership requirement:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

module.exports = {
    getOrganizationSettings,
    editOrganizationMembershipRequirements,
    editOrganizationEmailSettings,
    deleteOrganizationMembershipRequirement
};