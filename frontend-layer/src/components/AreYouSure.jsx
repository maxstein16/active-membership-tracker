import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate } from "react-router";

export default function AreYouSure({
  open,
  setOpen,
  navLink,
  funcInsteadOfNavLink,
}) {
  // Define my variables
  const navigate = useNavigate();

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
          This will delete all your changes, are you sure you want to move
          forward?
        </p>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className="secondary"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setOpen(false);
            if (navLink) {
              navigate(navLink);
              return;
            }
            funcInsteadOfNavLink()
          }}
        >
          Yes
        </button>
      </DialogActions>
    </Dialog>
  );
}
