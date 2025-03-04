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
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 22, 0, 0)}
        onSelectEvent={(eventInfo) => {
          let expandedEventInfo = events.filter(
            (event) => event.event_id === eventInfo.id
          )[0];
          setOpenEvent(expandedEventInfo);
        }}
        style={{
          height: "70vh",
          "--org-color": color,
          "--org-color-light": `${color}55`,
          "--org-color-light-2": `${color}15`,
        }}
      />
      <EventInfoPopup
        open={openEvent !== undefined}
        close={() => {
          setOpenEvent(undefined);
        }}
        color={color}
        event={openEvent}
      />
    </div>
  );
}
