const Error = require("./public/errors.js");
const {
  getOrganizationById,
  getOrganizationMembershipRequirements,
  editOrganizationMembershipRequirement,
  createOrganizationMembershipRequirement,
  createBonusRequirement,
  editBonusRequirement,
  deleteBonusRequirement,
  getBonusRequirements,
} = require("../data-layer/organization.js");
const {
  getEmailSettings,
  createEmailSettings,
  updateEmailSettings,
  deleteEmailSettings,
} = require("../data-layer/email-settings.js");
const { deleteMembershipRequirement } = require("../data-layer/membership.js");
const {
  getMemberAttendanceWithEvents,
} = require("../data-layer/attendance.js");
const error = new Error();

/**
 * Get organization settings by ID, including membership requirements and bonus requirements
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} Organization settings with membership & bonus requirements
 */
async function getOrganizationSettingsInDB(orgId) {
  try {
    // Get organization data
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return { error: error.organizationNotFound, data: null };
    }

    // Get associated membership settings with bonuses
    const membershipSettings = await getOrganizationMembershipRequirements(
      orgId
    );
    if (!membershipSettings) {
      return { error: error.settingNotFound, data: null };
    }

    // Get email settings
    const emailSettings = await getOrganizationEmailSettingsInDB(orgId);

    // Format the response to include bonus requirements
    const formattedData = {
      ...organization.toJSON(),
      email_settings: emailSettings?.dataValues || emailSettings?.data || null,
      membership_requirements: membershipSettings.map((membership) => {
        return {
          requirementId: membership.requirement_id,
          event_type: membership.event_type,
          requirement_type: membership.requirement_type,
          requirement_value: membership.requirement_value,
          bonuses: membership.bonusRequirements
            ? membership.bonusRequirements.map((bonus) => {
                return {
                  bonus_id: bonus.bonus_id,
                  threshold_percentage: bonus.threshold_percentage,
                  bonus_points: bonus.bonus_points,
                };
              })
            : [],
        };
      }),
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
    const created = await createOrganizationMembershipRequirement({
      ...data,
      organization_id: orgId,
      requirement_scope: data.frequency,
    });

    // console.log(created);
    if (!created) {
      return { error: error.settingNotFound, data: null };
    }

    return { error: error.noError, data: created };
  } catch (err) {
    console.error("Error creating membership requirements:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

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
}

/**
 * Delete an organization's membership requirement
 * @param {number} orgId - The ID of the organization
 * @param {number} requirementId - The ID of the membership requirement
 * @returns {Promise<Object>} Deletion status
 */
async function deleteOrganizationMembershipRequirementInDB(
  orgId,
  requirementId
) {
  try {
    // Verify organization exists
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      console.error(`Organization not found with ID: ${orgId}`);
      return { error: error.organizationNotFound, data: null };
    }

    // Get the membership requirement to verify it exists
    const memberships = await getOrganizationMembershipRequirements(orgId);
    const membership = memberships.find(
      (m) => m.requirement_id === requirementId
    );

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

/**
 * Create a bonus requirement for a membership requirement
 * @param {number} requirementId - The ID of the membership requirement
 * @param {object} bonusData - Threshold percentage and bonus points
 * @returns {Promise<Object>} Created bonus requirement
 */
async function createBonusRequirementInDB(requirementId, bonusData) {
  try {
    const newBonus = await createBonusRequirement(requirementId, bonusData);
    return { error: error.noError, data: newBonus };
  } catch (err) {
    console.error("Error creating bonus requirement:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Edit a bonus requirement
 * @param {number} bonusId - The ID of the bonus requirement
 * @param {object} updateData - Updated bonus data
 * @returns {Promise<Object>} Updated bonus requirement
 */
async function editBonusRequirementInDB(bonusId, updateData) {
  try {
    const updatedBonus = await editBonusRequirement(bonusId, updateData);
    if (!updatedBonus) {
      return { error: error.settingNotFound, data: null };
    }
    return { error: error.noError, data: updatedBonus };
  } catch (err) {
    console.error("Error updating bonus requirement:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

/**
 * Retrieves base points for an event type based on organization's membership requirements
 * @param {string} eventType - The type of event (e.g., 'General Meeting')
 * @param {number} orgId - Organization ID
 * @returns {Promise<number>} Base points for the event type
 */
async function getBasePointsForEventType(eventType, orgId) {
  try {
    const membershipRequirements = await getOrganizationMembershipRequirements(
      orgId
    );
    const matchingRequirement = membershipRequirements.find(
      (req) => req.event_type === eventType
    );
    return matchingRequirement ? matchingRequirement.requirement_value : 0;
  } catch (err) {
    console.error("Error fetching base points:", err);
    throw err;
  }
}

/**
 * Calculates bonus points based on attendance percentage using BonusRequirement model
 * @param {number} memberId - Member ID
 * @param {number} orgId - Organization ID
 * @param {string} eventType - Type of event (e.g., "General Meeting")
 * @param {Object} membership - Membership instance
 * @param {Array} attendanceRecords - Attendance records (optional, if already fetched)
 * @returns {Promise<number>} Bonus points earned
 */
async function calculateBonusPoints(
  memberId,
  orgId,
  eventType,
  membership,
  attendanceRecords = null
) {
  try {
    const membershipRequirements = await getOrganizationMembershipRequirements(
      orgId
    );
    const requirement = membershipRequirements.find(
      (req) => req.event_type === eventType
    );

    if (!requirement) return 0;

    const bonusRequirements = await getBonusRequirements(
      requirement.requirement_id
    );

    if (!attendanceRecords) {
      attendanceRecords = await getMemberAttendanceWithEvents(memberId, orgId);
    }

    const relevantAttendances = attendanceRecords.filter(
      (attendance) => attendance.Event.event_type === eventType
    );

    const totalEvents = requirement.total_required;
    const attendedEvents = relevantAttendances.length;
    const attendancePercentage = (attendedEvents / totalEvents) * 100;

    const alreadyReceivedBonuses = membership.received_bonus || [];

    let applicableBonus = bonusRequirements
      .filter(
        (bonus) =>
          attendancePercentage >= bonus.threshold_percentage &&
          !alreadyReceivedBonuses.includes(bonus.bonus_id)
      )
      .reduce((max, bonus) => Math.max(max, bonus.bonus_points), 0);

    if (applicableBonus > 0) {
      membership.membership_points += applicableBonus;
      membership.received_bonus.push(
        bonusRequirements.find(
          (bonus) => bonus.bonus_points === applicableBonus
        ).bonus_id
      );
      await membership.save();
    }

    return applicableBonus;
  } catch (err) {
    console.error("Error calculating bonus points:", err);
    throw err;
  }
}

/**
 * Delete a bonus requirement
 * @param {number} bonusId - The ID of the bonus requirement
 * @returns {Promise<Object>} Deletion status
 */
async function deleteBonusRequirementInDB(bonusId) {
  try {
    const deleted = await deleteBonusRequirement(bonusId);
    if (!deleted) {
      return { error: error.settingNotFound, data: null };
    }
    return { error: error.noError, data: { deleted: true } };
  } catch (err) {
    console.error("Error deleting bonus requirement:", err);
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
  deleteOrganizationMembershipRequirementInDB,
  createBonusRequirementInDB,
  editBonusRequirementInDB,
  getBasePointsForEventType,
  calculateBonusPoints,
  deleteBonusRequirementInDB,
};
