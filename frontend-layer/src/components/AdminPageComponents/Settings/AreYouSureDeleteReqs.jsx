import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function AreYouSureDeleteReqs({
  color, 
  open,
  setOpen,
  isPoints,
  setIsPoints,
  saveSetting,
}) {

  return (
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <p>
          If you change your requirements type, it will <span className="error"><strong>delete</strong> all of your saved membership requirements.</span>
        </p>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className="custom-color-button secondary"
          style={{ color: color, borderColor: color }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setIsPoints(!isPoints);
            saveSetting(!isPoints, "isPointBased");
          }}
          className="custom-color-button"
          style={{ backgroundColor: color, borderColor: color }}
        >
          Yes
        </button>
      </DialogActions>
    </Dialog>
  );
}
