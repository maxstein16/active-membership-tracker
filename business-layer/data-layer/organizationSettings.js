import { Organization, MembershipRequirement,  EmailSettings } from "../db";

/**
 * get membership requirements for an organization
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} The membership requirements of the organization
 */
const getMembershipRequirements = async (orgId) => {
    try {
      const requirements = await MembershipRequirement.findAll({
        where: { organization_id: orgId },
      });
  
      if (requirements.length === 0) {
        console.error(`Organization with ID ${orgId} not found`);
        return null;
      }
  
      return {
        status: "success",
        data: {
          organization_id: orgId,
          active_membership_requirements: requirements,
        },
      };
    } catch (err) {
      console.error("Error fetching membership requirements:", err);
      throw err;
    }
  };

  /**
 * Update membership requirements for an organization
 * @param {number} orgId - The ID of the organization
 * @param {Object} updates - The data to update in the membership requirements
 * @returns {Promise<Object|null>} The updated membership requirements, or null if not found
 */
const updateMembershipRequirements = async (orgId, updates) => {
    try {
      const { setting_id, meeting_type, frequency, amount_type, amount } = updates;
  
      if (!setting_id || (!meeting_type && !frequency && !amount_type && !amount)) {
        console.error("Must include at least a setting_id and one valid field to update: meeting_type, frequency, amount_type, amount");
        return null;
      }
  
      const requirement = await MembershipRequirement.findOne({
        where: { organization_id: orgId, setting_id },
      });
  
      if (!requirement) {
        console.error(`Organization setting with ID ${setting_id} not found`);
        return null;
      }
  
      const updatedRequirement = await requirement.update({
        meeting_type: meeting_type || requirement.meeting_type,
        frequency: frequency || requirement.frequency,
        amount_type: amount_type || requirement.amount_type,
        amount: amount || requirement.amount,
      });
  
      return {
        status: "success",
        data: updatedRequirement,
      };
    } catch (err) {
      console.error("Error updating membership requirement:", err);
      throw err;
    }
  };

/**
 * Delete a membership requirement for an organization
 * @param {number} orgId - The ID of the organization
 * @param {number} id - The ID of the membership requirement
 * @returns {Promise<Object|null>} The updated organization data, or null if not found
 */
const deleteMembershipRequirement = async (orgId, id) => {
    try {
      if (!id) {
        console.error("Must include an id as a query param");
        return { error: "must include an id as a query param" };
      }
  
      const organization = await Organization.findOne({
        where: { organization_id: orgId },
        include: [
          {
            model: MembershipRequirement,
            as: "membership_requirements",
          },
        ],
      });
  
      if (!organization) {
        console.error(`Organization with ID ${orgId} not found`);
        return { error: `organization with id of ${orgId} not found` };
      }
  
      const requirement = await MembershipRequirement.findOne({
        where: { setting_id: id, organization_id: orgId },
      });
  
      if (!requirement) {
        console.error(`Membership requirement with ID ${id} not found`);
        return { error: `organization membership requirement with id of ${id} not found` };
      }
  
      await requirement.destroy();
  
      // Refetch the updated list of membership requirements
      const updatedRequirements = await MembershipRequirement.findAll({
        where: { organization_id: orgId },
      });
  
      return {
        status: "success",
        data: {
          organization_id: organization.organization_id,
          organization_name: organization.organization_name,
          active_membership_requirements: updatedRequirements,
        },
      };
    } catch (err) {
      console.error("Error deleting membership requirement:", err);
      throw err;
    }
  };

  /**
 * Update email settings for an organization
 * @param {number} orgId - The ID of the organization
 * @param {Object} updates - The data to update in the email settings
 * @returns {Promise<Object|null>} The updated email settings, or null if not found
 */
const updateEmailSettings = async (orgId, updates) => {
    try {
      const { current_status, annual_report, semester_report, membership_achieved } = updates;
  
      if (!current_status && !annual_report && !semester_report && !membership_achieved) {
        console.error("Must include at least one valid field to edit: current_status, annual_report, semester_report, membership_achieved");
        return null;
      }
  
      const settings = await EmailSettings.findOne({
        where: { organization_id: orgId },
      });
  
      if (!settings) {
        console.error(`Organization with ID ${orgId} not found`);
        return null;
      }
  
      const updatedSettings = await settings.update({
        current_status: current_status || settings.current_status,
        annual_report: annual_report || settings.annual_report,
        semester_report: semester_report || settings.semester_report,
        membership_achieved: membership_achieved || settings.membership_achieved,
      });
  
      return {
        status: "success",
        data: updatedSettings,
      };
    } catch (err) {
      console.error("Error updating email settings:", err);
    }
}  

/**
 * Fetch settings for an organization
 * @param {number} orgId - The ID of the organization
 * @returns {Promise<Object>} The settings of the organization
 */
const getOrganizationSettings = async (orgId) => {
    try {
      const organization = await Organization.findOne({
        where: { organization_id: orgId },
        include: [
          {
            model: MembershipRequirement,
            as: "membership_requirements",
          },
          {
            model: EmailSettings,
            as: "email_settings",
          },
        ],
      });
  
      if (!organization) {
        console.error(`Organization with ID ${orgId} not found`);
        return null;
      }
  
      return {
        status: "success",
        data: organization,
      };
    } catch (err) {
      console.error("Error fetching organization settings:", err);
      throw err;
    }
  };
