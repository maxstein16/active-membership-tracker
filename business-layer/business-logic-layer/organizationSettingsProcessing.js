const Error = require("./public/errors.js");
const { getEmailSettings, createEmailSettings, updateEmailSettings, deleteEmailSettings } = require("../data-layer/email-settings.js");
const error = new Error();

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

module.exports = {
    getOrganizationEmailSettingsInDB,
    createOrganizationEmailSettingsInDB,
    updateOrganizationEmailSettingsInDB,
    deleteOrganizationEmailSettingsInDB
};