const { Recognition, Organization } = require("../db.js");
const Error = require("./public/errors.js");
const error = new Error();

/**
 * Get all active membership recognitions that belong to one organization
 * @param {number} orgId Organization Id
 * @returns {Promise<Object>} organization's recognitions
 */
async function getAllOrgRecognitionsFromDB(orgId) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }

    // get the data from data-layer
    const recognitions = await Recognition.findAll();

    // if the list is empty return error
    if (!recognitions || recognitions.length < 1) {
      return { error: error.noRecognitionsFound, data: null };
    }

    // filter out recognitions for only this organization
    const recognitionsFromOrgId = recognitions.filter(
      (recognition) => recognition.orgId && recognition.orgId == orgId
    );

    // return error if there are no recognitions
    if (!recognitionsFromOrgId || recognitionsFromOrgId.length < 1) {
      return { error: error.thisOrgHasNoRecognitions, data: null };
    }

    // find organization data
    const organization = await Organization.findOne({
      where: { organization_id: orgId },
    });

    // if no org, return error
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
        member_list: recognitions,
      },
    };
  } catch (err) {
    console.error("Error fetching organization recognitions:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function getSpecificRecognitionFromDB(orgId, memberId) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }

    // get the data from data-layer
    // TODO: causing ERROR: Unknown column 'organization_id' in SELECT.... don't know how to fix this ( i added the foreign key to the db )
    const recognition = await Recognition.findOne({
      where: { organization: orgId, member: memberId },
    });

    // if the result is empty return error
    if (!recognition || recognition.length < 1) {
      return { error: error.noRecognitionsFound, data: null };
    }

    return {
      error: error.noError,
      data: recognition,
    };
  } catch (err) {
    console.error("Error fetching specific organization recognition:", err);
    return { error: error.somethingWentWrong, data: null };
  }
}

async function updateSpecificRecognitionInDB(orgId, memberId, membershipYears) {
  try {
    // is orgId an int?
    if (isNaN(orgId)) {
      return { error: error.organizationIdMustBeInteger, data: null };
    }

    // get the data from data-layer
    const [updatedRows] = await Recognition.update(
      { recognition_year: membershipYears },
      {
        where: {
          organization_id: orgId,
          membership_id: memberId,
        },
      }
    );

    // if the result is empty return error
    if (updatedRows === 0) {
      return { error: error.noRecognitionsFound, data: null };
    }

    return {
      error: error.noError,
      data: { membershipYears: membershipYears },
    };
  } catch (err) {
    console.error("Error fetching specific organization recognition:", err);
    return { error: error.somethingWentWrong, data: null };
  }

}

module.exports = {
  getAllOrgRecognitionsFromDB,
  getSpecificRecognitionFromDB,
  updateSpecificRecognitionInDB,
};
