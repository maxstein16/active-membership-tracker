import { API_METHODS, getAPIData } from "./callAPI"

/**
 * get settings data from the api
 * @param {Number} orgId - organization id from the db
 * @returns the data we got back
 */
export async function getOrganizationSettingsData(orgId) {
    const result = await getAPIData(`/organization/${orgId}`, API_METHODS.get, {})
    if (!result) {
        return {error: true}
    }
    console.log(result)
    return {}
}

/**
 * Save the info settings to the database 
 * @param {Number} orgId - organization id from the db
 * @param {String} newValue - new value the user just entered
 * @param {String} settingName - appropriate settingName (organization_name, organization_abbreviation, organization_description, organization_color, active_memberhsip_threshold)
 * @returns true if no errors, false if error :(
 */
export async function saveInfoSetting(orgId, newValue, settingName) {
    return true
}

/**
 * Save the email settings to the db on each toggle
 * @param {Number} orgId - organization id from the db
 * @param {Number} emailSettingsId - id for the org's email settings
 * @param {Boolean} newValue - whether the setting is now turned on or off
 * @param {String} settingName - name of the specific email setting in question
 * @returns true of there was no error, otherwise false
 */
export async function saveEmailSetting(orgId, emailSettingsId, newValue, settingName) {
    return true
}

/**
 * Save the specific membership requirement setting to the db on edit
 * @param {Number} orgId - organization id from the db
 * @param {Number} requirementId - membership requirement id to edit
 * @param {String} newValue - new setting
 * @param {String} settingName - specific setting from the membership requirement to edit (meeting_type, frequency, amount_type, amount, requirement_scope)
 * @returns true of there was no error, otherwise false
 */
export async function saveMembershipRequirementDetail(orgId, requirementId, newValue, settingName) {
    return true
}

/**
 * Create a new membership requirement with default data
 * @param {Number} orgId - organization id from the db 
 * @param {Boolean} isPoints - points or percentage?
 * @returns the new requirement
 */
export async function createNewMembershipRequirement(orgId, isPoints) {
    return {}
}

/**
 * Get all the members of an organization to display
 * @param {Number} orgId - organization id from the db 
 * @returns list of members 
 */
export async function getOrganizationMembers(orgId) {
    const result = getAPIData(`/organization/${orgId}/members`, API_METHODS.get, {})
    console.log(result)
    return []
}