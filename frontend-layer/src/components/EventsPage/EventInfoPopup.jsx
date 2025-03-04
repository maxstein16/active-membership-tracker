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

export default function EventInfoPopup({ orgId, open, close, color, event }) {

    // if the event is in the future you can edit it
    
  return (
    <Dialog
      onClose={close}
      open={open}
    >
      <DialogTitle>{event ? event.event_name : "Title Here"}</DialogTitle>
      <DialogContent>
        <p>{JSON.stringify(event)}</p>
        <UploadDataModal orgId={orgId} color={color} />
      </DialogContent>
      <DialogActions>
        <button
          onClick={close}
          className="custom-color-button"
          style={{backgroundColor: color, borderColor: color}}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
