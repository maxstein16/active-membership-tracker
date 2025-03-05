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
  await new Promise(( resolve, reject ) => {
    event.attendances.forEach(async (attendee, index) => {
      const memberData = await getAPIData(
        `/member/${attendee.member_id}`,
        API_METHODS.get,
        {}
      );
      if (memberData && memberData.hasOwnProperty("data")) {
        // console.log(memberData.data)
        attendeesMemberData.push({...memberData.data}); // needs the copy because it causes an error otherwise
      }
      if (index === event.attendances.length - 1) {
        resolve()
      }
    });
  })

  return attendeesMemberData;
}
