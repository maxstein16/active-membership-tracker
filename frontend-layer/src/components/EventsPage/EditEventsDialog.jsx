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

export default function EventInfoPopup({ orgId, open, close, color, event }) {
  // if the event is in the future you can edit it
  const [isFuture, setIsFuture] = React.useState(false);

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <p>Changes are saved as you enter them</p>
      </DialogContent>
      <DialogActions>
        <button
          onClick={close}
          className="custom-color-button"
          style={{ backgroundColor: color, borderColor: color }}
        >
          View Event
        </button>
      </DialogActions>
    </Dialog>
  );
}
