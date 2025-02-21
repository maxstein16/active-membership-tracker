const Error = require("./public/errors.js");
const error = new Error();

const { Recognition } = require("../db.js");
const { getOrganizationById } = require("../data-layer/organization.js");


/**
 * Base recognition functions for data layer
 */
const getRecognitionsByAttributes = async (filters) => {
    try {
        const recognitions = await Recognition.findAll({ where: filters });
        return recognitions;
    } catch (error) {
        console.error("Error fetching recognitions by attributes:", error);
        throw error;
    }
};

const updateRecognition = async (filters, updateData) => {
    try {
        const [updatedRows] = await Recognition.update(updateData, { where: filters });
        return updatedRows > 0;
    } catch (error) {
        console.error("Error updating recognition:", error);
        throw error;
    }
};

/**
 * Get all active membership recognitions that belong to one organization
 * @param {number} orgId Organization Id
 * @returns {Promise<Object>} organization's recognitions
 */
async function getAllOrgRecognitionsFromDB(orgId) {
    try {
        if (isNaN(orgId)) {
            return { error: error.organizationIdMustBeInteger, data: null };
        }

        // Get all recognitions
        const recognitions = await getRecognitionsByAttributes({});

        if (!recognitions || recognitions.length < 1) {
            return { error: error.noRecognitionsFound, data: null };
        }

        // Filter recognitions for this organization
        const recognitionsFromOrgId = recognitions.filter(
            recognition => recognition.orgId && recognition.orgId == orgId
        );

        if (!recognitionsFromOrgId || recognitionsFromOrgId.length < 1) {
            return { error: error.thisOrgHasNoRecognitions, data: null };
        }

        // Get organization data
        const organization = await getOrganizationById(orgId);

        if (!organization) {
            return { error: error.orgNotFound, data: null };
        }

        return {
            error: error.noError,
            data: {
                organization_id: orgId,
                organization_name: organization.organization_name,
                organization_abbreviation: organization.organization_abbreviation,
                organization_threshold: organization.organization_threshold,
                member_list: recognitions.map(rec => rec.toJSON())
            }
        };
    } catch (err) {
        console.error("Error fetching organization recognitions:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Get specific recognition for a member in an organization
 * @param {number} orgId Organization Id
 * @param {number} memberId Member Id
 * @returns {Promise<Object>} Recognition details
 */
async function getSpecificRecognitionFromDB(orgId, memberId) {
    try {
        if (isNaN(orgId)) {
            return { error: error.organizationIdMustBeInteger, data: null };
        }

        const recognition = await getRecognitionsByAttributes({ 
            organization: orgId, 
            member: memberId 
        });

        const firstRecognition = recognition && recognition[0];
        if (!firstRecognition) {
            return { error: error.noRecognitionsFound, data: null };
        }

        return {
            error: error.noError,
            data: firstRecognition.toJSON()
        };
    } catch (err) {
        console.error("Error fetching specific organization recognition:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

/**
 * Update recognition years for a specific member in an organization
 * @param {number} orgId Organization Id
 * @param {number} memberId Member Id
 * @param {number} membershipYears Years of membership
 * @returns {Promise<Object>} Updated recognition details
 */
async function updateSpecificRecognitionInDB(orgId, memberId, membershipYears) {
    try {
        if (isNaN(orgId)) {
            return { error: error.organizationIdMustBeInteger, data: null };
        }

        const updated = await updateRecognition(
            {
                organization_id: orgId,
                membership_id: memberId
            },
            { 
                recognition_year: membershipYears 
            }
        );

        if (!updated) {
            return { error: error.noRecognitionsFound, data: null };
        }

        return {
            error: error.noError,
            data: { membershipYears: membershipYears }
        };
    } catch (err) {
        console.error("Error updating specific organization recognition:", err);
        return { error: error.somethingWentWrong, data: null };
    }
}

module.exports = {
    getAllOrgRecognitionsFromDB,
    getSpecificRecognitionFromDB,
    updateSpecificRecognitionInDB
};