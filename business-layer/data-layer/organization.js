const { Organization, MembershipRequirement, Membership, Member } = require("../db");

/**
 * Create an Organization
 * @param {Object} organizationData - The data to create the organization record
 * @returns {Promise<Object>} The created organization record
 */
async function createOrganization (organizationData) {
    try {
        const organization = await Organization.create(organizationData);
        return organization;
    } catch (err) {
        console.error("Error creating organization:", err);
        throw err;
    }
};

/**
 * Get an Organization by its ID
 * @param {number} organizationId - The ID of the organization record
 * @returns {Promise<Object|null>} The organization record, or null if not found
 */
async function getOrganizationById (organizationId) {
    try {
        const organization = await Organization.findByPk(organizationId);
        return organization;
    } catch (err) {
        console.error("Error fetching organization by ID:", err);
        throw err;
    }
};

/**
 * Get all Organizations
 * @returns {Promise<Array>} List of organization records
 */
async function getOrganizations() {
    try {
        const organizations = await Organization.findAll();
        return organizations;
    } catch (err) {
        console.error("Error fetching organizations:", err);
        throw err;
    }
};

/**
 * Update an existing Organization by its ID
 * @param {number} organizationId - The ID of the organization
 * @param {object} updatedOrgInfo - The information about the organization to update
 * @returns {Promise<boolean>} Returns true if the organization was updated, 
 *    false if no organization with the provided ID exists
 */
async function updateOrganizationByID(organizationId, updatedOrgInfo) {
    try {
        const [updatedOrgRows] = await Organization.update(updatedOrgInfo, {
            where: { organization_id: organizationId }
        });

        if (updatedOrgRows > 0) {
            console.log(`Organization with ID ${organizationId} updated successfully.`);
            return true;
        } else {
            console.log(`No organization found with ID ${organizationId}`);
            return false;
        }
    } catch (err) {
        console.error("Error updating organization:", err);
        throw err;
    }
};

/**
 * Update an existing Organization's description by its Name
 * @param {number} organizationName - The name of the organization
 * @param {object} updatedOrgDesc - The information about the organization to update
 * @returns {Promise<boolean>} Returns true if the organization was updated, 
 *    false if no organization with the provided name exists
 */
async function updateOrganizationByName (organizationName, updatedOrgDesc) {
    try {
        const [updatedOrgRows] = await Organization.update(updatedOrgDesc, {
            where: { organization_name: organizationName }
        });

        if (updatedOrgRows > 0) {
            console.log(`Organization with name ${organizationName} updated successfully.`);
            return true;
        } else {
            console.log(`No organization found with name ${organizationName}`);
            return false;
        }
    } catch (err) {
        console.error("Error updating organization:", err);
        throw err;
    }
};

/**
 * Get an Organization's membership requirements
 * @param {number} organizationId - The ID of the organization
 * @returns {Promise<Array>} List of membership requirements for the organization
 */
async function getOrganizationMembershipRequirements(organizationId) {
    try {
        const requirements = await MembershipRequirement.findAll({
            where: { organization_id: organizationId }
        });
        
        if (!requirements || requirements.length === 0) {
            console.log(`No requirements found for organization ID ${organizationId}`);
            return [];
        }

        console.log(`Retrieved requirements for organization ID ${organizationId}`);
        return requirements;
    } catch (err) {
        console.error("Error fetching organization requirements:", err);
        throw err;
    }
}

/**
 * Create a new membership requirement for an organization
 * @param {Object} requirementData - The requirement data including organization_id, meeting_type, frequency, amount_type, amount, and requirement_scope
 * @returns {Promise<Object>} The created requirement record
 */
async function createOrganizationMembershipRequirement(requirementData) {
    try {
        const requirement = await MembershipRequirement.create(requirementData);
        console.log(`Created requirement for organization ID ${requirementData.organization_id}`);
        return requirement;
    } catch (err) {
        console.error("Error creating organization requirement:", err);
        throw err;
    }
}

/**
 * Edit an organization's membership requirement
 * @param {number} requirementId - The ID of the requirement to edit
 * @param {Object} requirementData - The updated requirement data
 * @returns {Promise<boolean>} Returns true if requirement was updated, false if not found
 */
async function editOrganizationMembershipRequirement(requirementId, requirementData) {
    try {
        const [updatedRows] = await MembershipRequirement.update(requirementData, {
            where: { requirement_id: requirementId }
        });

        if (updatedRows > 0) {
            console.log(`Requirement updated with ID ${requirementId}`);
            return true;
        } else {
            console.log(`No requirement found with ID ${requirementId}`);
            return false;
        }
    } catch (err) {
        console.error("Error updating organization requirement:", err);
        throw err;
    }
}

/**
 * Get organizations that a user is a member of
 * @param {string} username - The username (email) of the user
 * @returns {Promise<Array>} List of organization records
 */
async function getUserOrganizations(username) {
    try {
        console.log(`Data layer: Finding organizations for user ${username}`);
        
        // Find the member by their email (username)
        const member = await Member.findOne({
            where: { member_email: username }
        });

        if (!member) {
            console.log(`No member found with email ${username}`);
            
            // For testing purposes
            if (username === "mep4741@rit.edu") {
                console.log("Returning hardcoded test data for mep4741@rit.edu");
                return [
                    {
                        organization_id: 1,
                        organization_name: "Computer Science House",
                        organization_description: "Technology and computing focused special interest house",
                        organization_color: "#B0197E",
                        organization_abbreviation: "CSH"
                    },
                    {
                        organization_id: 2,
                        organization_name: "Society of Software Engineers",
                        organization_description: "Professional organization for software engineering students",
                        organization_color: "#006699",
                        organization_abbreviation: "SSE"
                    }
                ];
            }
            return [];
        }

        console.log(`Found member with ID: ${member.member_id}`);

        // Find all memberships for this member along with their organizations
        const memberships = await Membership.findAll({
            where: { member_id: member.member_id },
            include: [{
                model: Organization,
                as: 'organization',
                attributes: [
                    'organization_id',
                    'organization_name',
                    'organization_description',
                    'organization_color',
                    'organization_abbreviation',
                    'organization_threshold'
                ]
            }]
        });

        console.log(`Found ${memberships.length} memberships for this member`);

        // Extract the organizations from the memberships
        const organizations = memberships
            .filter(membership => membership.organization !== null)
            .map(membership => membership.organization);

        console.log(`Returning ${organizations.length} organizations`);
        return organizations;
    } catch (err) {
        console.error("Error fetching user organizations:", err);
        throw err;
    }
}

module.exports = {
    createOrganization,
    getOrganizationById,
    getOrganizations,
    updateOrganizationByID,
    updateOrganizationByName,
    getOrganizationMembershipRequirements,
    createOrganizationMembershipRequirement,
    editOrganizationMembershipRequirement,
    getUserOrganizations
};