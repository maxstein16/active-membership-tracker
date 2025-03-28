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
import { ROLE_MEMBER } from "../../utils/constants";
import { toAMPMtime } from "../../utils/toAMPMtime";
import EditEventsDialog from "./EditEventsDialog";
import ManualAddAttendanceDialog from "./ManualAddAttendanceDialog";

export default function EventInfoPopup({
  orgId,
  role,
  open,
  close,
  color,
  event,
}) {
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

  const getDateTimeRange = () => {
    let start = moment(event.event_start).toDate();
    let end = moment(event.event_end).toDate();

    // is the event on one day?
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    ) {
      return `${start.toDateString()} from ${toAMPMtime(start)} to ${toAMPMtime(
        end
      )}`;
    }

    return `${start.toDateString()} at ${toAMPMtime(
      start
    )} to ${end.toDateString()} at ${toAMPMtime(end)}`;
  };

  const formattedMeetingType = () => {
    return event.event_type.replace("_", " ");
  };

  return (
    <>
      <Dialog onClose={close} open={open}>
        <DialogTitle>{event ? event.event_name : "Title Here"}</DialogTitle>
        <DialogContent>
          {/* EVENT DATA */}
          <p style={{ textTransform: "capitalize" }}>
            <i>{formattedMeetingType()}</i>
          </p>
          <p>{getDateTimeRange()}</p>
          <p>
            <strong>{event.event_location}</strong>
          </p>
          <br />
          <p>{event.event_description}</p>

          {/* ACTION BUTTONS */}
          {role !== ROLE_MEMBER ? (
            <div className="event-info-popup-buttons">
              <EditEventsDialog
                  isEdit={true}
                  orgId={orgId}
                  color={color}
                  event={event}
                />
              {isFuture ? (
                <></>
              ) : (
                <>
                  <UploadDataModal
                    orgId={orgId}
                    eventId={event.event_id}
                    color={color}
                  />
                  <ManualAddAttendanceDialog
                    orgId={orgId}
                    color={color}
                    event={event}
                  />
                </>
              )}
            </div>
          ) : (
            <></>
          )}

          {!isFuture && role !== ROLE_MEMBER && (
            <DisplayEventAttendance orgId={orgId} color={color} event={event} />
          )}
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
    </>
  );
}
