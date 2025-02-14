import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

export default function EventTable({ orgId, color }) {
  // define variables
  const [events, setEvents] = React.useState(undefined);

  // get initial data
  React.useEffect(() => {
    // get the data from the database with the orgId

    // set the setEvents state variable
    // the data MUST BE FORMATTED AND LABELLED LIKE THIS
    setEvents([
      {
        eventId: 0,
        eventType: "Meeting",
        eventDate: '2024-02-01',
        totalAttendance: 32,
      },
    ]);
  }, []);

  return (
    <div className="event-table-wrapper">
        <h2>Events</h2>
        <p>Click on an event to learn more.</p>
        <p>{JSON.stringify(events)}</p>
    </div>
  );
}
