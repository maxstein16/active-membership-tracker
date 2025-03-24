import moment from "moment";
import { API_METHODS, getAPIData } from "./callAPI";

/**
 * 
 * @param {Number} orgId - organization id from DB
 * @returns JSON object that looks like this:
 *  "orgData": {
            "organization_id": 1,
            "organization_name": "Women In Computing",
            "organization_abbreviation": "WiC",
            "organization_desc": "Our Mission is to build a supportive community that celebrates the talent of underrepresented students in Computing. We work to accomplish our mission by providing mentorship, mental health awareness, and leadership opportunities.",
            "organization_color": 0x123456
            "organization_threshold": 48,
    }
    "events": [
        // events api call
    ]
 */
export async function getEventsAndOrgColor(orgId) {
  // get org details
  const orgDetails = await getAPIData(
    `/organization/${orgId}`,
    API_METHODS.get,
    {}
  );

  if (!orgDetails) {
    console.log("must login", orgDetails);
    return { session: false };
  }
  if (!orgDetails.data || orgDetails.data == null) {
    console.log("Error: ", orgDetails);
    return { error: true };
  }

  // get events
  const events = await getAPIData(
    `/organization/${orgId}/events`,
    API_METHODS.get,
    {}
  );

  if (!events) {
    console.log("must login", events);
    return { session: false };
  }
  if (!events.data || events.data == null) {
    console.log("Error: ", events);
    return { error: true };
  }

  // put them together
  const eventsDataTotal = {
    orgData: orgDetails.data,
    events: events.data,
  };

  return eventsDataTotal;
}

/**
 * The calendar needs the events in a specific format
 * @param {*} events - list of events from the API
 * @return array with objects that look like:
 * {
 *   id: event_id
 *   start: moment date
 *   end: moment date
 *   title: title
 * }
 */
export function turnEventsToCalendarEvents(events) {
  let calendarEvents = [];
  events.forEach((event) => {
    calendarEvents.push({
      id: event.event_id,
      start: moment(event.event_start).toDate(),
      end: moment(event.event_end).toDate(),
      title: event.event_name,
    });
  });
  return calendarEvents;
}

/**
 * Give the event and it will return all the attendees member information
 * @param {*} event
 * @returns An array of member data
 */
export async function getAttendanceMemberData(event) {
  let attendeesMemberData = [];
  await new Promise((resolve, reject) => {
    event.attendances.forEach(async (attendee, index) => {
      const memberData = await getAPIData(
        `/member/${attendee.member_id}`,
        API_METHODS.get,
        {}
      );
      if (memberData && memberData.hasOwnProperty("data")) {
        // console.log(memberData.data)
        try {
          // ignore this error it doesn't harm the data: TypeError: Cannot add property 2, object is not extensible
          attendeesMemberData.push({ ...memberData.data }); // needs the copy because it causes an error otherwise
        } catch (error) {
          console.log("error: ", error);
        }
      }
      if (index === event.attendances.length - 1) {
        resolve();
      }
    });
  });

  return attendeesMemberData;
}

/**
 * Save the specific event setting to the db on edit
 * @param {Number} orgId - organization id from the db
 * @param {Number} eventId - event id to edit
 * @param {String} newValue - new setting
 * @param {String} settingName - specific setting from the event database to edit
 * @returns true of there was no error, otherwise false
 */
export async function updateEventSetting(
  orgId,
  eventId,
  newValue,
  settingName
) {
  let body = {};
  body[settingName] = newValue;

  if (settingName === "event_type" && newValue === "general meeting") {
    body[settingName] = "general_meeting";
  }
  // console.log(body)

  // call the api
  const result = await getAPIData(
    `/organization/${orgId}/events/${eventId}`,
    API_METHODS.put,
    body
  );
  // console.log(result);

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
 * Create a new event in the DB
 * @param {*} orgId - org the event belongs to
 * @param {*} newEventData - all the data required for the API call
 * @returns true if no errors, false if errors
 */
export async function createNewEvent(orgId, newEventData) {
  const body = { ...newEventData };
  if (body.event_type === "general meeting") {
    body.event_type = "general_meeting";
  }
  console.log(body);

  // call the api
  const result = await getAPIData(
    `/organization/${orgId}/events/`,
    API_METHODS.post,
    body
  );
  console.log(result);

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

export async function getMembersInOrg(orgId) {
  const result = await getAPIData(
    `/organization/${orgId}/member`,
    API_METHODS.get,
    {}
  );

  if (!result || result.hasOwnProperty("error")) {
    return [];
  }

  let returnData = [];
  result.data.forEach((member) => {
    returnData.push({
      member: member.member_name,
      id: member.member_id,
    });
  });
  return returnData;
}

export async function getAllMembers() {
  const result = await getAPIData(`/member/all`, API_METHODS.get, {});

  if (!result || result.hasOwnProperty("error")) {
    return [];
  }

  let returnData = [];
  result.data.data.forEach((member) => {
    returnData.push({
      member: member.member_name,
      id: member.member_id,
    });
  });
  return returnData;
}

export async function manuallyAddAttendanceToDB(
  orgId,
  eventId,
  memberId,
  points
) {
  // add attendance
  const member = await getAPIData(`/attendance`, API_METHODS.post, {
    member_id: memberId,
    event_id: eventId,
  });
  console.log(member)
  if (!member || member.hasOwnProperty("error")) {
    return false;
  }

  // check if need to add extra points (one is added by default)
  if (points > 1) {
    // get the current membership points
    const member = await getAPIData(
      `/organization/${orgId}/member/${memberId}`,
      API_METHODS.get,
      {}
    );
    if (!member || member.hasOwnProperty("error")) {
      return false;
    }

    // add the new extra ones (one is automatically added)
    console.log(member.data.membership.membership_points);
    let newPoints = member.data.membership.membership_points + points - 1;
    const result = await getAPIData(
      `/organization/${orgId}/member/${memberId}`,
      API_METHODS.put,
      {
        membership_points: newPoints,
      }
    );

    if (!result || result.hasOwnProperty("error")) {
      return false;
    }
  }

  return true;
}
