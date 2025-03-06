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

  if (!detailSettings) {
    console.log("must login", detailSettings)
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
  detailSettings.data.membership_requirements.forEach((requirement) => {
    orgData.membershipRequirements.push({
      id: requirement.requirementId,
      meetingType: requirement.meeting_type,
      frequency: requirement.frequency,
      amountType: requirement.amount_type,
      amount: requirement.amount,
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
  if (settingName === 'threshold') {
      try {
        newValue = parseInt(newValue)
      } catch (error) {
        console.log("Threshold must be a number")
        return false
      }
  }
  
  let body = {};
  body[`organization_${settingName}`] = newValue;
  console.log(body);
  const result = await getAPIData(
    `/organization/${orgId}`,
    API_METHODS.put,
    body
  );
  console.log(result);

  if (!result) {
    console.log("must login", result)
    return false;
  }
  if (result.status && result.status === "success") {
    return true;
  }
  return false;
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
    console.log("must login", result)
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
    meetingType: "meeting_type",
    frequency: "frequency",
    amountType: "amount_type",
    amount: "amount",
  };
  let body = { requirement_id: requirementId };
  body[switchTable[settingName]] = newValue;
  console.log(body);

  // call the api
  const result = await getAPIData(
    `/organization/${orgId}/settings/membership-requirements`,
    API_METHODS.put,
    body
  );
  console.log(result);

  if (!result) {
    console.log("must login", result)
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
      meeting_type: "general meeting",
      frequency: "semesterly",
      amount_type: isPoints ? "points" : "percentage",
      amount: 1,
    }
  );

  if (!newMembership) {
      console.log("must login", newMembership)
      return { session: false };
    }
  if (newMembership.hasOwnProperty("error")) {
    return { error: true };
  }
  return newMembership.data;
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
    console.log("must login", result)
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

  const pastEvents = result.data.filter(event => {
    return event.event_end && event.event_end < currentDate;
  });

  return pastEvents;
}

export async function getMeetingReport(orgId, meetingId) {
  const apiUrl = `/organization/${orgId}/reports/meeting/${meetingId}`;

  const result = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!result || !result.orgData) {
    return { members: [], totalAttendance: 0 };
  }

  const attendanceData = result.orgData.attendance;

  if (!attendanceData || !attendanceData.members_who_attended) {
    return { members: [], totalAttendance: 0 };
  }

  const formattedMembers = attendanceData.members_who_attended.map(member => ({
    id: member.member_id,
    member_name: `${member.firstName} ${member.lastName}`,
    member_email: `${member.rit_username}@rit.edu`,
    role: member.role_num
  }));

  return {
    members: formattedMembers,
    totalAttendance: attendanceData.total_attendance || 0,
    activeMemberAttendance: attendanceData.active_member_attendance || 0,
    inactiveMemberAttendance: attendanceData.inactive_member_attendance || 0,
  };
}

export async function getAnnualReportData(orgId) {
  const apiUrl = `/organization/${orgId}/reports/annual`;

  const response = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!response || !response.orgData) {
    console.error("Error fetching annual report data.");
    return null;
  }

  return response.orgData;
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
  const apiUrl = `/organization/${orgId}/reports/meeting/${meetingId}`;

  const response = await getAPIData(apiUrl, API_METHODS.get, {});

  if (!response || !response.orgData) {
    console.error("Error fetching meeting report data.");
    return null;
  }

  return response.orgData;
}