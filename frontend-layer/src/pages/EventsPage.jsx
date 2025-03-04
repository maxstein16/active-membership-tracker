import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";
import "react-big-calendar/lib/css/react-big-calendar.css"

import { useParams } from "react-router";
import PageSetup from "../components/PageSetup/PageSetup";
import BackButton from "../components/BackButton";
import { CircularProgress } from "@mui/material";
import { getEventsAndOrgColor } from "../utils/eventsCalls";
import displayErrors from "../utils/displayErrors";
import EventCalendar from "../components/EventsPage/EventCalendar";

export default function EventsPage() {
  // Define my variables
  const { orgId } = useParams();
  const [orgData, setOrgData] = React.useState(undefined);
  const [events, setEvents] = React.useState(undefined);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // get API data 
    getEventsAndOrgColor(orgId).then((result) => {
      // console.log(result)
      if (result.hasOwnProperty("session")) {
        setError(displayErrors.noSession);
      } else if (!result.hasOwnProperty("error")) {
        setError("");
        setOrgData(result.orgData);
        setEvents(result.events)
      } else {
        setError(displayErrors.errorFetchingContactSupport);
      }
    });
  }, [orgId]);

  return (
    <PageSetup>
      <BackButton route={`/${orgId}/status`} />
      {error !== "" ? (
        <p className="error">{error}</p>
      ) : !events || !orgData ? (
        <CircularProgress />
      ) : (
        <>
          <h1>{orgData.organization_abbreviation} Events</h1>
          {/* Add new event */}
          <EventCalendar orgId={orgId} color={orgData.organization_color} events={events}/>
        </>
      )}
    </PageSetup>
  );
}
