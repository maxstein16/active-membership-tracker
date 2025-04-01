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
      email:
      threshold: 
      isPointBased: 
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
          eventType
          type
          value
          bonuses: [
            id:
            threshold: 
            points:  
          ]
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

  if (!detailSettings) {
    console.log("must login", detailSettings);
    return { session: false };
  }
  if (!detailSettings || detailSettings.data == null) {
    return { error: true };
  }

  // format
  let orgData = {
    name: detailSettings.data.organization_name,
    abbreviation: detailSettings.data.organization_abbreviation,
    color: detailSettings.data.organization_color,
    description: detailSettings.data.organization_description,
    email: detailSettings.data.organization_email,
    threshold: detailSettings.data.organization_threshold,
    isPointBased: detailSettings.data.organization_membership_type === "points",
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
  // need to get these specifically
  detailSettings.data.membership_requirements.forEach((requirement) => {
    orgData.membershipRequirements.push({
      id: requirement.requirementId,
      eventType: requirement.event_type,
      type: requirement.requirement_type,
      value: requirement.requirement_value,
      bonuses: requirement.bonuses.map((bonus) => {
        return {
          id: bonus.bonus_id,
          threshold: bonus.threshold_percentage,
          points: bonus.bonus_points,
        };
      }),
    });
  });

  return orgData;
}

/**
 * Save the info settings to the database
 * @param {Number} orgId - organization id from the db
 * @param {String} newValue - new value the user just entered
 * @param {String} settingName - appropriate settingName (name, abbreviation, description, color, threshold)
 * @returns true if no errors, false if error :(
 */
export async function saveInfoSetting(orgId, newValue, settingName) {
  if (settingName === "threshold") {
    try {
      newValue = parseInt(newValue);
    } catch (error) {
      console.log("Threshold must be a number");
      return false;
    }
  }

  let body = {};

  if (settingName === "isPointBased") {
    body[`organization_membership_type`] = newValue ? "points" : "attendance";
  } else {
    body[`organization_${settingName}`] = newValue;
  }

  const result = await getAPIData(
    `/organization/${orgId}`,
    API_METHODS.put,
    body
  );

  if (!result) {
    console.log("must login", result);
    return false;
  }
  if (result.status && result.status === "success") {
    if (settingName === "isPointBased") {
      return await deleteAllRequirements(orgId);
    }
    return true;
  }
  return false;
}

async function deleteAllRequirements(orgId) {
  // get all org requirements
  const settings = await getAPIData(
    `/organization/${orgId}/settings`,
    API_METHODS.get,
    {}
  );

  if (!settings || settings.data == null) {
    console.log("must login", settings);
    return false;
  }

  let numReqs = settings.data.membership_requirements.length;

  // delete all of them
  await new Promise((resolve, reject) => {
    settings.data.membership_requirements.forEach(
      async (requirement, index) => {
        const isSuccess = await getAPIData(
          `/organization/${orgId}/settings/membership-requirements?id=${requirement.requirementId}`,
          API_METHODS.delete,
          {}
        );

        if (!isSuccess || isSuccess.hasOwnProperty("error")) {
          console.log(
            `Error deleting requirement ${requirement.requirementId} from org ${orgId}: `,
            isSuccess
          );
        }

        if (index === numReqs - 1) {
          resolve();
        }
      }
    );
  });
  return true;
}

/**
 * Save the email settings to the db on each toggle
 * @param {Number} orgId - organization id from the db
 * @param {Boolean} newValue - whether the setting is now turned on or off
 * @param {String} settingName - name of the specific email setting in question
 * @returns true of there was no error, otherwise false
 */
export async function saveEmailSettingInDB(orgId, newValue, settingName) {
  // set the body variable to edit correctly
  const switchTable = {
    monthlyStatus: "current_status",
    annual: "annual_report",
    semester: "semester_report",
    membershipAchieved: "membership_achieved",
  };
  let body = {};
  body[switchTable[settingName]] = newValue;
  //   console.log(body);

  // call the api
  const result = await getAPIData(
    `/organization/${orgId}/settings/email-settings`,
    API_METHODS.put,
    body
  );
  //   console.log(result);

  if (!result) {
    console.log("must login", result);
    return false;
  }
  // decide return
  if (result.status && result.status === "success") {
    return true;
  }
  return false;
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
  // set the body variable to edit correctly
  const switchTable = {
    eventType: "event_type",
    type: "requirement_type",
    value: "requirement_value"
  };
  let body = { requirement_id: requirementId };
  body[switchTable[settingName]] = newValue;

  // call the api
  const result = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements`,
    API_METHODS.put,
    body
  );

  if (!result) {
    console.log("must login", result);
    return false;
  }
  // decide return
  if (result.status && result.status === "success") {
    return true;
  }
  return false;
}

export async function saveBonusRequirementDetail(
  orgId,
  bonusId,
  newValue,
  settingName
) {
  // set the body variable to edit correctly
  const switchTable = {
    threshold: "threshold_percentage",
    points: "bonus_points"
  };
  let body = { bonus_id: bonusId };
  body[switchTable[settingName]] = newValue;

  // call the api
  const result = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements/bonuses`,
    API_METHODS.put,
    body
  );

  if (!result) {
    console.log("must login", result);
    return false;
  }
  // decide return
  if (result.status && result.status === "success") {
    return true;
  }
  return false;
}

/**
 * Create a new membership requirement with default data
 * @param {Number} orgId - organization id from the db
 * @param {Boolean} isPoints - points or percentage?
 * @returns the new requirement
 */
export async function createNewMembershipRequirementInDB(orgId, isPoints) {
  const newMembership = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements`,
    API_METHODS.post,
    {
      event_type: "general meeting",
      requirement_type: isPoints ? "points" : "attendance_count",
      requirement_value: 1,
    }
  );

  if (!newMembership) {
    console.log("must login", newMembership);
    return { session: false };
  }
  if (newMembership.hasOwnProperty("error")) {
    return { error: true };
  }
  return newMembership.data;
}

// same as create new membership req but for bonuses
export async function createNewBonusRequirementInDB(orgId, reqId) {
  const newBonus = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements/bonuses`,
    API_METHODS.post,
    {
      threshold_percentage: 50,
      bonus_points: 1,
      requirement_id: reqId,
    }
  );

  if (!newBonus) {
    console.log("must login", newBonus);
    return { session: false };
  }
  if (newBonus.hasOwnProperty("error")) {
    return { error: true };
  }
  return newBonus.data;
}

/**
 * Delete the requirement from the database
 * @param {*} orgId - organization id from the db
 * @param {*} requirementId - requirement id to delete
 * @returns true if no error, false otherwise
 */
export async function deleteMemberRequirement(orgId, requirementId) {
  const result = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements?id=${requirementId}`,
    API_METHODS.delete,
    {}
  );

  if (!result || result.hasOwnProperty("error")) {
    return false;
  }
  return true;
}

/**
 * Delete the requirement from the database
 * @param {*} orgId - organization id from the db
 * @param {*} bonusId - bonus id to delete
 * @returns true if no error, false otherwise
 */
export async function deleteBonusRequirement(orgId, bonusId) {
  const result = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements/bonuses?bonus_id=${bonusId}`,
    API_METHODS.delete,
    {}
  );

  if (!result || result.hasOwnProperty("error")) {
    return false;
  }
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
  if (!result) {
    console.log("must login", result);
    return { session: false };
  }
  if (result.hasOwnProperty("error")) {
    return [];
  }
  return result.data;
}

export async function getPastOrganizationEvents(orgId) {
  const result = await getAPIData(
    `/organization/${orgId}/events`,
    API_METHODS.get,
    {}
  );

  if (!result) {
    console.log("must login", result);
    return { session: false };
  }
  if (result.hasOwnProperty("error")) {
    return [];
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const pastEvents = result.data.filter((event) => {
    return event.event_end && event.event_end < currentDate;
  });

  return pastEvents;
}

export async function getMeetingReport(orgId, meetingId) {
  const apiUrl = `/organization/${orgId}/reports/event/${meetingId}`;

  const result = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!result || !result.orgData) {
    return { members: [], totalAttendance: 0 };
  }

  const attendanceData = result.orgData.attendance;

  if (!attendanceData || !attendanceData.members_who_attended) {
    return { members: [], totalAttendance: 0 };
  }

  const formattedMembers = attendanceData.members_who_attended.map(
    (member) => ({
      id: member.member_id,
      member_name: `${member.firstName} ${member.lastName}`,
      member_email: `${member.rit_username}@rit.edu`,
      role: member.role_num,
    })
  );

  return {
    members: formattedMembers,
    totalAttendance: attendanceData.total_attendance || 0,
    activeMemberAttendance: attendanceData.active_member_attendance || 0,
    inactiveMemberAttendance: attendanceData.inactive_member_attendance || 0,
  };
}

/**
 * Get organization creation date to determine if it's a new org
 * @param {Number} orgId - organization id from the db
 * @returns {Date|null} The creation date or null if not found
 */
export async function getOrganizationCreationDate(orgId) {
  try {
    const orgData = await getOrganizationData(orgId);
    if (orgData && (orgData.createdAt || orgData.created_at)) {
      return new Date(orgData.createdAt || orgData.created_at);
    }
    return null;
  } catch (err) {
    console.error("Error fetching organization creation date:", err);
    return null;
  }
}

/**
 * Get annual report data for an organization
 * @param {Number} orgId - organization id from the db
 * @returns {Object|null} Report data or null if error
 */
export async function getAnnualReportData(orgId) {
  try {
    const apiUrl = `/organization/${orgId}/reports/annual`;
    const response = await getAPIData(apiUrl, API_METHODS.get, {});

    if (!response) {
      console.error("Failed to get response from annual report API");
      return null;
    }
    
    if (!response.orgData) {
      console.error("No organization data in API response");
      return null;
    }

    // Check if this is a new organization based on API response
    const isNewOrg = response.orgData.isNewOrg || false;
    
    // If historical data is not present in a new org, set them to null
    if (isNewOrg) {
      response.orgData.memberDataLast = null;
      response.orgData.meetingsDataLast = null;
    }

    return response.orgData;
  } catch (err) {
    console.error("Error fetching annual report data:", err);
    return null;
  }
}

/**
 * Get annual report data for an organization by specific year
 * @param {Number} orgId - organization id from the db
 * @param {Number} year - The year to get data for
 * @returns {Object|null} Report data or null if error
 */
export async function getAnnualReportDataByYear(orgId, year) {
  try {
    // First check if the org existed in this year
    const creationDate = await getOrganizationCreationDate(orgId);
    if (creationDate) {
      const creationYear = creationDate.getFullYear();
      if (year < creationYear) {
        // Return empty data structure for years before the org existed
        return {
          isNewOrg: true,
          current_year: year,
          memberDataThis: {
            totalMembers: 0,
            newMembers: 0,
            totalActive_members: 0,
            newActive_members: 0,
            members: []
          },
          memberDataLast: null,
          meetingsDataThis: {
            numMeetings: 0,
            numEvents: 0,
            numVolunteering: 0,
            totalAttendance: 0
          },
          meetingsDataLast: null
        };
      }
    }

    const apiUrl = `/organization/${orgId}/reports/annual/${year}`;
    const response = await getAPIData(apiUrl, API_METHODS.get, {});

    if (!response) {
      console.error("Failed to get response from annual report by year API");
      return null;
    }
    
    if (!response.orgData) {
      console.error(`No organization data in API response for year ${year}`);
      return null;
    }

    return response.orgData;
  } catch (err) {
    console.error(`Error fetching annual report data for year ${year}:`, err);
    return null;
  }
}


export async function getSemesterReportData(orgId) {
  const apiUrl = `/organization/${orgId}/reports/semesterly`;

  const response = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!response || !response.orgData) {
    console.error("Error fetching semester report data.");
    return null;
  }

  return response.orgData;
}

export async function getMeetingReportData(orgId, meetingId) {
  const apiUrl = `/organization/${orgId}/reports/event/${meetingId}`;

  const response = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!response || !response.orgData) {
    console.error("Error fetching meeting report data.");
    return null;
  }

  return response.orgData;
}

export async function getAllSemestersAcrossYears() {
  try {
    const academicYearsResponse = await getAllAcademicYears();
    
    if (!Array.isArray(academicYearsResponse)) {
      console.error("Failed to fetch academic years");
      return [];
    }
    
    const semestersMap = new Map();
    
    for (const year of academicYearsResponse) {
      const yearResult = await getAPIData(
        `/semester/year/${year}`,
        API_METHODS.get,
        {}
      );
      
      if (yearResult && yearResult.data && Array.isArray(yearResult.data)) {
        yearResult.data.forEach(semester => {
          if (!semestersMap.has(semester.semester_id)) {
            semestersMap.set(semester.semester_id, semester);
          }
        });
      }
    }
    
    return Array.from(semestersMap.values());
  } catch (err) {
    console.error("Error fetching all semesters:", err);
    return [];
  }
}

export async function getSemesterReportDataById(orgId, semesterId) {
  const apiUrl = `/organization/${orgId}/reports/semesterly/${semesterId}`;

  const response = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!response || !response.orgData) {
    console.error("Error fetching semester report data for semester ID:", semesterId);
    return null;
  }

  return response.orgData;
}

/**
 * Get academic years relevant for an organization
 * @param {Number} orgId - organization id from the db
 * @returns {Array} List of years available for this organization
 */
export async function getAllAcademicYears(orgId) {
  try {
    // Get all available academic years from the standard endpoint
    const result = await getAPIData(
      `/semester/academic-years`,
      API_METHODS.get,
      {}
    );

    if (!result) {
      console.log("must login", result);
      return { session: false };
    }
    
    if (!result.data || result.error) {
      console.error("Error fetching academic years:", result.error);
      return [];
    }
    
    // If no orgId provided, return all years (for backward compatibility)
    if (!orgId) {
      return result.data;
    }
    
    // For organizations, we'll need to get the years that have org data
    // First, fetch the organization's events to see what years they have data for
    const orgEvents = await getPastOrganizationEvents(orgId);
    
    if (!Array.isArray(orgEvents) || orgEvents.length === 0) {
      return [];
    }
    
    // Extract years from event dates
    const orgYears = new Set();
    orgEvents.forEach(event => {
      if (event.event_end) {
        const eventYear = new Date(event.event_end).getFullYear();
        if (!isNaN(eventYear)) {
          orgYears.add(eventYear);
        }
      }
    });
        
    // Filter the academic years to only include those where the org has data
    const filteredYears = result.data.filter(year => {
      // Handle different year formats
      let yearValue;
      if (typeof year === 'number') {
        yearValue = year;
      } else if (typeof year === 'string') {
        if (year.includes('-')) {
          // For academic years like "2023-2024", check if either year is in the set
          const [startYear, endYear] = year.split('-').map(y => parseInt(y));
          return !isNaN(startYear) && (orgYears.has(startYear) || orgYears.has(endYear));
        } else {
          yearValue = parseInt(year);
        }
      }
      
      return !isNaN(yearValue) && orgYears.has(yearValue);
    });
    
    return filteredYears;
  } catch (err) {
    console.error(`Error in getAllAcademicYears for org ${orgId}:`, err);
    return [];
  }
}

/**
 * Get member data for a specific member in an organization
 * @param {Number} orgId - organization id from the db
 * @param {Number} memberId - member id to fetch data for
 * @returns member data including membership info
 */
export async function getMemberData(orgId, memberId) {
  const result = await getAPIData(
    `/organization/${orgId}/member/${memberId}`,
    API_METHODS.get,
    {}
  );
  
  if (!result) {
    console.log("must login", result);
    return { session: false };
  }
  if (result.hasOwnProperty("error")) {
    return { error: true };
  }
  return result.data;
}

/**
 * Get general organization data
 * @param {Number} orgId - organization id from the db
 * @returns organization data
 */
export async function getOrganizationData(orgId) {
  const result = await getAPIData(
    `/organization/${orgId}`,
    API_METHODS.get,
    {}
  );
  
  if (!result) {
    console.log("must login", result);
    return { session: false };
  }
  if (result.hasOwnProperty("error")) {
    return { error: true };
  }
  return result.data;
}