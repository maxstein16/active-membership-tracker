const { EmailSettings } = require('../db');

/**
 * Get email settings for an organization
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} Email settings object
 */
const getEmailSettings = async (orgId) => {
    try {
        return await EmailSettings.findOne({
            where: { organization_id: orgId }
        });
    } catch (error) {
        console.error('Error in getEmailSettings:', error);
        throw error;
    }
};

/**
 * Create email settings for an organization
 * @param {number} orgId - The ID of the organization
 * @param {Object} settingsData - Email settings data
 * @returns {Promise<Object>} Created email settings
 */
const createEmailSettings = async (orgId, settingsData) => {
    try {
        return await EmailSettings.create({
            organization_id: orgId,
            ...settingsData
        });
    } catch (error) {
        console.error('Error in createEmailSettings:', error);
        throw error;
    }
};

/**
 * Update email settings for an organization
 * @param {number} orgId - The ID of the organization
 * @param {Object} settingsData - Updated email settings data
 * @returns {Promise<Object>} Updated email settings
 */
const updateEmailSettings = async (orgId, settingsData) => {
    try {
        const settings = await EmailSettings.findOne({
            where: { organization_id: orgId }
        });

        if (!settings) {
            return null;
        }

        return await settings.update(settingsData);
    } catch (error) {
        console.error('Error in updateEmailSettings:', error);
        throw error;
    }
};

/**
 * Delete email settings for an organization
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<boolean>} True if successful, false if not found
 */
const deleteEmailSettings = async (orgId) => {
    try {
        const settings = await EmailSettings.findOne({
            where: { organization_id: orgId }
        });

        if (!settings) {
            return false;
        }

        await settings.destroy();
        return true;
    } catch (error) {
        console.error('Error in deleteEmailSettings:', error);
        throw error;
    }
};

module.exports = {
    getEmailSettings,
    createEmailSettings,
    updateEmailSettings,
    deleteEmailSettings
};