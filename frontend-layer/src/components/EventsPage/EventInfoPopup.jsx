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
  const [isEditing, setIsEditing] = React.useState(false);

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
      {isEditing ? (
        <EventInfoPopup orgId={orgId}
        open={open}
        close={() => {setIsEditing(false); close()}}
        color={color}
        event={event} />
      ) : (
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
            ) : (
              <></>
            )}

            {/* ATTENDANCE DATA */}
            {role !== ROLE_MEMBER ? (
              <DisplayEventAttendance
                orgId={orgId}
                color={color}
                event={event}
              />
            ) : (
              <></>
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
      )}
    </>
  );
}
