import { API_METHODS, getAPIData } from "./callAPI";

/**
 * get settings data from the api
 * @param {Number} orgId - organization id from the db
 * @returns the data we got back
 * 
 * Format: 
 * {
      name: 
      abbreviation: 
      color: 
      description: 
      threshold: 
      emailSettings: {
        id
        monthlyStatus
        annual
        semester
        membershipAchieved
      },
      membershipRequirements: [
        {
          id
          meetingType
          frequency
          amountType
          amount
          requirementScope
        },
        ...
      ],
    }
 */
export async function getOrganizationSettingsData(orgId) {
  // get settings
  const detailSettings = await getAPIData(
    `/organization/${orgId}/settings`,
    API_METHODS.get,
    {}
  );
  if (!detailSettings || detailSettings.data == null) {
    return { error: true };
  }

  // format
  let orgData = {
    name: detailSettings.data.organization_name,
    abbreviation: detailSettings.data.organization_abbreviation,
    color: detailSettings.data.organization_color,
    description: detailSettings.data.organization_description,
    threshold: detailSettings.data.organization_threshold,
    emailSettings: {
      id: detailSettings.data.email_settings.email_setting_id,
      monthlyStatus: detailSettings.data.email_settings.current_status,
      annual: detailSettings.data.email_settings.annual_report,
      semester: detailSettings.data.email_settings.semester_report,
      membershipAchieved:
        detailSettings.data.email_settings.membership_achieved,
    },
    membershipRequirements: [],
  };

  // fill in membership requirements
  detailSettings.data.membership_requirements.forEach(requirement => {
    orgData.membershipRequirements.push({
        id: requirement.requirementId,
        meetingType: requirement.meeting_type,
        frequency: requirement.frequency,
        amountType: requirement.amount_type,
        amount: requirement.amount
    })
  });

  return orgData;
}

/**
 * Save the info settings to the database
 * @param {Number} orgId - organization id from the db
 * @param {String} newValue - new value the user just entered
 * @param {String} settingName - appropriate settingName (organization_name, organization_abbreviation, organization_description, organization_color, active_memberhsip_threshold)
 * @returns true if no errors, false if error :(
 */
export async function saveInfoSetting(orgId, newValue, settingName) {
  return true;
}

/**
 * Save the email settings to the db on each toggle
 * @param {Number} orgId - organization id from the db
 * @param {Number} settingId - email setting id from the db
 * @param {Boolean} newValue - whether the setting is now turned on or off
 * @param {String} settingName - name of the specific email setting in question
 * @returns true of there was no error, otherwise false
 */
export async function saveEmailSetting(
  orgId,
  settingId,
  newValue,
  settingName
) {
  return true;
}

/**
 * Save the specific membership requirement setting to the db on edit
 * @param {Number} orgId - organization id from the db
 * @param {Number} requirementId - membership requirement id to edit
 * @param {String} newValue - new setting
 * @param {String} settingName - specific setting from the membership requirement to edit (meeting_type, frequency, amount_type, amount, requirement_scope)
 * @returns true of there was no error, otherwise false
 */
export async function saveMembershipRequirementDetail(
  orgId,
  requirementId,
  newValue,
  settingName
) {
  return true;
}

/**
 * Create a new membership requirement with default data
 * @param {Number} orgId - organization id from the db
 * @param {Boolean} isPoints - points or percentage?
 * @returns the new requirement
 */
export async function createNewMembershipRequirement(orgId, isPoints) {
  return {};
}

/**
 * Delete the requirement from the database
 * @param {*} orgId - organization id from the db
 * @param {*} requirementId - requirement id to delete
 * @returns true if no error, false otherwise
 */
export async function deleteMemberRequirement(orgId, requirementId) {
  return true;
}

/**
 * Get all the members of an organization to display
 * @param {Number} orgId - organization id from the db
 * @returns list of members
 */
export async function getOrganizationMembers(orgId) {
  const result = await getAPIData(
    `/organization/${orgId}/member`,
    API_METHODS.get,
    {}
  );
  console.log(result);
  if (!result || result.hasOwnProperty("error")) {
    return [];
  }
  return result.data;
}
