const Error = require("./public/errors.js");
const { getOrganizationById, getOrganizationMembershipRequirements, editOrganizationMembershipRequirement, createOrganizationMembershipRequirement } = require("../data-layer/organization.js");
const { getEmailSettings, createEmailSettings, updateEmailSettings, deleteEmailSettings } = require("../data-layer/email-settings.js");
const { deleteMembershipRequirement } = require("../data-layer/membership.js");
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
        if (!membershipSettings) {
            return { error: error.settingNotFound, data: null };
        }

        // Get email settings
        const emailSettings = await getOrganizationEmailSettingsInDB(orgId)

        // Format the response to match expected structure
        const formattedData = {
            ...organization.toJSON(),
            email_settings: emailSettings.data.dataValues,
            membership_requirements: membershipSettings.map(membership => ({
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
}

/**
 * Get organization email settings
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} Email settings with error status
 */
async function getOrganizationEmailSettingsInDB(orgId) {
    try {
        const settings = await getEmailSettings(orgId);
        
        if (!settings) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: settings };
    } catch (err) {
        console.error("Error fetching email settings:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Create organization email settings
 * @param {number} orgId - The ID of the organization
 * @param {Object} settingsData - Email settings data
 * @returns {Promise<Object>} Created settings with error status
 */
async function createOrganizationEmailSettingsInDB(orgId, settingsData) {
    try {
        // Check if settings already exist
        const existingSettings = await getEmailSettings(orgId);
        if (existingSettings) {
            return { error: error.settingsAlreadyExist, data: null };
        }

        const newSettings = await createEmailSettings(orgId, settingsData);
        return { error: error.noError, data: newSettings };
    } catch (err) {
        console.error("Error creating email settings:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Update organization email settings
 * @param {number} orgId - The ID of the organization
 * @param {Object} settingsData - Updated email settings data
 * @returns {Promise<Object>} Updated settings with error status
 */
async function updateOrganizationEmailSettingsInDB(orgId, settingsData) {
    try {
        const updatedSettings = await updateEmailSettings(orgId, settingsData);
        
        if (!updatedSettings) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: updatedSettings };
    } catch (err) {
        console.error("Error updating email settings:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Delete organization email settings
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} Deletion status with error
 */
async function deleteOrganizationEmailSettingsInDB(orgId) {
    try {
        const deleted = await deleteEmailSettings(orgId);
        
        if (!deleted) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: { deleted: true } };
    } catch (err) {
        console.error("Error deleting email settings:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}


/**
 * Create membership requirement
 * @param {number} orgId - The ID of the organization
 * @param {object} data - new membership requirements data
 * @returns {Promise<Object>} Updated membership requirements
 */
async function createOrganizationMembershipRequirementsInDB(orgId, data) {
    try {
        // Verify organization exists
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            return { error: error.organizationNotFound, data: null };
        }

        // Update membership settings
        const created = await createOrganizationMembershipRequirement({...data, organization_id: orgId, requirement_scope: data.frequency});

        console.log(created)
        if (!created) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: created };
    } catch (err) {
        console.error("Error creating membership requirements:", err);
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
            console.error(`Organization not found with ID: ${orgId}`);
            return { error: error.organizationNotFound, data: null };
        }

        // Get the membership requirement to verify it exists
        const memberships = await getOrganizationMembershipRequirements(orgId);
        const membership = memberships.find(m => m.requirement_id === requirementId);

        if (!membership) {
            return { error: error.settingNotFound, data: null };
        }

        const deleted = await deleteMembershipRequirement(requirementId);

        if (!deleted) {
            return { error: error.settingNotFound, data: null };
        }

        return { error: error.noError, data: { deleted: true } };
    } catch (err) {
        console.error("Error deleting membership requirement:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

module.exports = {
    getOrganizationSettingsInDB,
    getOrganizationEmailSettingsInDB,
    editOrganizationMembershipRequirementsInDB,
    createOrganizationMembershipRequirementsInDB,
    createOrganizationEmailSettingsInDB,
    updateOrganizationEmailSettingsInDB,
    deleteOrganizationEmailSettingsInDB,
    deleteOrganizationMembershipRequirementInDB
};