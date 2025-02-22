const Error = require("../business-logic-layer/public/errors.js");
const { getOrganizationById, updateOrganizationByID, getOrganizationMembershipRequirements, editOrganizationMembershipRequirement } = require("../data-layer/organization.js");
const error = new Error();

/**
 * Get organization settings by ID
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} Organization settings
 */
async function getOrganizationSettingsInDB(orgId) {
    try {
        // Get organization data
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            return { error: error.organizationNotFound, data: null };
        }

        // Get associated membership settings
        const membershipSettings = await getOrganizationMembershipRequirements(orgId);

        // Format the response to match expected structure
        const formattedData = {
            ...organization.toJSON(),
            Memberships: membershipSettings.map(membership => ({
                requirementId: membership.requirement_id,
                meeting_type: membership.meeting_type,
                frequency: membership.frequency,
                amount_type: membership.amount_type,
                amount: membership.amount
            }))
        };

        return { error: error.noError, data: formattedData };
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
async function editOrganizationMembershipRequirementsInDB(orgId, orgData) {
    try {
        // Verify organization exists
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            return { error: error.organizationNotFound, data: null };
        }

        // Update membership settings
        const updated = await editOrganizationMembershipRequirement(
            orgData.requirement_id,
            { ...orgData, organization_id: orgId }
        );

        if (!updated) {
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
async function editOrganizationEmailSettingsInDB(orgId, orgData) {
    try {
        const updated = await updateOrganizationByID(orgId, orgData);

        if (!updated) {
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
 * @param {number} requirementId - The ID of the membership requirement
 * @returns {Promise<Object>} Deletion status
 */
async function deleteOrganizationMembershipRequirementInDB(orgId, requirementId) {
    try {
        // Verify organization exists
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            return { error: error.organizationNotFound, data: null };
        }

        // Get the membership requirement to verify it exists
        const memberships = await getOrganizationMembershipRequirements(orgId);
        const membership = memberships.find(m => m.requirement_id === requirementId);

        if (!membership) {
            return { error: error.settingNotFound, data: null };
        }

        // Delete the membership requirement
        await membership.destroy();

        return { error: error.noError, data: { deleted: true } };
    } catch (err) {
        console.error("Error deleting membership requirement:", err);
        return { error: error.somethingWentWrong, data: null };
    }
};

module.exports = {
    getOrganizationSettingsInDB,
    editOrganizationMembershipRequirementsInDB,
    editOrganizationEmailSettingsInDB,
    deleteOrganizationMembershipRequirementInDB
};