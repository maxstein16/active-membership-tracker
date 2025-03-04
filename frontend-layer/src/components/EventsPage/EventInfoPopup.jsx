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

export default function EventInfoPopup({ open, close, color, event }) {
  return (
    <Dialog
      onClose={close}
      open={open}
    >
      <DialogTitle>{event ? event.event_name : "Title Here"}</DialogTitle>
      <DialogContent>
        <p>{JSON.stringify(event)}</p>
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
