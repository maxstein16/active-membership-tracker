import { API_METHODS, getAPIData } from "./callAPI";
import displayErrors from "./displayErrors";

/**
 * Add all the org data from the create new org (same as settings page)
 * @param {Object} orgData - data from settings or create org page
 * @returns null if there is no error, otherwise an error string
 */
export async function createNewOrgInDB(orgData) {
  const check = checkData(orgData);
  // if a return exists then there is an error
  if (check) {
    return check;
  }

  let numberThreshold = 0;
  try {
    numberThreshold = parseInt(orgData.threshold);
  } catch (error) {
    return displayErrors.thresholdMustBeNumber;
  }

  // add org basic details to db + create default email settings
  const newOrg = await getAPIData("/organization", API_METHODS.post, {
    organization_name: orgData.name,
    organization_abbreviation: orgData.abbreviation,
    organization_description: orgData.description,
    organization_email: orgData.email,
    organization_color: orgData.color,
    organization_threshold: numberThreshold,
    organization_membership_type: orgData.isPointBased
      ? "points"
      : "attendance",
  });

  if (!newOrg) {
    console.log("must login", newOrg);
    return displayErrors.noSession;
  }

  if (
    newOrg.hasOwnProperty("error") &&
    newOrg.error === "Invalid contact email format."
  ) {
    return "Please put a real email";
  }

  if (newOrg.hasOwnProperty("error")) {
    console.log("Something went wrong creating the new org: ", newOrg);
    return displayErrors.somethingWentWrong;
  }

  // save org id for easier use later
  const newOrgId = newOrg.data.organization_id;

  // edit email settings
  const result = await getAPIData(
    `/organization/${newOrgId}/settings/email-settings`,
    API_METHODS.put,
    {
      current_status: orgData.emailSettings.monthlyStatus,
      annual_report: orgData.emailSettings.annual,
      semester_report: orgData.emailSettings.semester,
      membership_achieved: orgData.emailSettings.membershipAchieved,
    }
  );

  if (!result) {
    console.log("must login", result);
    return displayErrors.noSession;
  }
  if (result.hasOwnProperty("error")) {
    console.log("Something went wrong saving the email settings: ", result);
    return displayErrors.somethingWentWrong;
  }

  // add membership requirements
  orgData.membershipRequirements.forEach(async (requirement) => {
    const newRequirement = await getAPIData(
      `/organization/${newOrgId}/settings/membership-requirements`,
      API_METHODS.post,
      {
        event_type: requirement.eventType,
        requirement_type: orgData.isPointBased ? "points" : "attendance_count",
        requirement_value: requirement.value,
      }
    );

    if (!newRequirement || newRequirement.hasOwnProperty("error")) {
      console.log(
        "Something went wrong saving membership requirements: ",
        newRequirement
      );
    } else {
      requirement.bonuses.forEach(async (bonus) => {
        await getAPIData(
          `/organization/${newOrgId}/settings/membership-requirements/bonuses`,
          API_METHODS.post,
          {
            threshold_percentage: bonus.threshold,
            bonus_points: bonus.points,
            requirement_id: newRequirement.data.requirement_id,
          }
        );
      });
    }
  });

  return null;
}

// check to make sure all data is there
function checkData(orgData) {
  // check for missing basic info
  let missingFields = [];
  Object.keys(orgData).forEach((key) => {
    let data = orgData[key];
    if (data === "") {
      missingFields.push(key);
    }
  });

  // if they are missing fields return error
  if (missingFields.length > 0) {
    return `Missing ${missingFields.join(", ")}`;
  }

  // check if there is at least one membership req
  if (orgData.membershipRequirements.length < 1) {
    return "Must have at least one membership requirement";
  }

  // check if number fields have numbers
  let needsNumber = [];
  if (isNaN(orgData.threshold)) {
    needsNumber.push("Active Membership Threshold");
  }

  orgData.membershipRequirements.forEach((requirement, index) => {
    if (isNaN(requirement.value)) {
      needsNumber.push(`Requirement #${index + 1} value`);
    }
    requirement.bonuses.forEach((bonus, bindex) => {
      if (isNaN(bonus.points)) {
        needsNumber.push(`Requirement ${index}'s Bonus #${bindex + 1} points`);
      }
      if (isNaN(bonus.threshold)) {
        needsNumber.push(`Requirement ${index}'s Bonus #${bindex + 1} amount`);
      }
    });
  });

  if (needsNumber.length > 0) {
    return `These fields must have numerical values: ${needsNumber.join(", ")}`;
  }

  return null;
}
