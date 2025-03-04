import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import UploadDataModal from "../AdminPageComponents/UploadDataModal";
import moment from "moment";
import DisplayEventAttendance from "./DisplayEventAttendance";

export default function EventInfoPopup({ orgId, open, close, color, event }) {
  // if the event is in the future you can edit it
  const [isFuture, setIsFuture] = React.useState(false);

  React.useEffect(() => {
    // is the event in the future?
    let startDate = moment(event.event_start).toDate();
    let now = new Date();

    if (startDate > now) {
      setIsFuture(true);
    }
  }, [event]);

  const temp = {
    event_id: 4,
    event_name: "COMS Workshop: Resume Building",
    event_start: "2025-02-12T22:30:00.000Z",
    event_end: "2025-02-13T00:00:00.000Z",
    event_location: "GOL 2250",
    event_description:
      "Learn how to craft a compelling resume with industry professionals.",
    event_type: "workshop",
    organization_id: 2,
    semester_id: null,
  };

  const getDateTimeRange = () => {
    let start = moment(event.event_start).getDate()
    let end = moment(event.event_end).getDate()
    return 0
  }

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>{event ? event.event_name : "Title Here"}</DialogTitle>
      <DialogContent>
        <p>{JSON.stringify(event)}</p>
        {/* EVENT DATA */}
        <p>Event Time: {() => getDateTimeRange()}</p>

        {/* ACTION BUTTONS */}
        <div className="event-info-popup-buttons">
          {isFuture ? (
            <button
              onClick={() => {}}
              style={{ color: color, borderColor: color }}
              className="secondary custom-color-button"
            >
              Edit Event
            </button>
          ) : (
            <></>
          )}
          <UploadDataModal
            orgId={orgId}
            eventId={event.event_id}
            color={color}
          />
        </div>

        {/* ATTENDANCE DATA */}
        <DisplayEventAttendance orgId={orgId} color={color} event={event} />
      </DialogContent>
      <DialogActions>
        {/* CLOSE DIALOG */}
        <button
          onClick={close}
          className="custom-color-button"
          style={{ backgroundColor: color, borderColor: color }}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
