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

export default function SuccessDialog({ open, setOpen }) {
  // Define my variables
  const navigate = useNavigate();

  return (
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <DialogTitle>Success!</DialogTitle>
      <DialogContent>
        <p>
          Your organization has been created. Add it to campus groups and host events to get members.
        </p>
      </DialogContent>
      <DialogActions>
        <button onClick={() => {setOpen(false); navigate("/")}}>Ok</button>
      </DialogActions>
    </Dialog>
  );
}
