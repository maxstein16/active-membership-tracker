import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { turnEventsToCalendarEvents } from "../../utils/eventsCalls";
import EventInfoPopup from "./EventInfoPopup";

export default function EventCalendar({ color, events }) {
  const localizer = momentLocalizer(moment);
  const [calendarEvents] = React.useState(turnEventsToCalendarEvents(events));
  const [openEvent, setOpenEvent] = React.useState(undefined);

  return (
    <div>
      <Calendar
        className="calendar-buttons"
        localizer={localizer}
        events={calendarEvents}
        // events={test.events}
        defaultDate={new Date()}
        defaultView="month"
        style={{ height: '70vh' }}
        onSelectEvent={(eventInfo) => {
            let expandedEventInfo = events.filter((event) => event.event_id === eventInfo.id)[0]
            setOpenEvent(expandedEventInfo)
        }}
      />
      <EventInfoPopup open={openEvent !== undefined} close={() => {setOpenEvent(undefined)}} color={color} event={openEvent}/>
    </div>
  );
}
