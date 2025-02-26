import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


export default function CreateNewRequirement({
  color,
  createNewRequirement
}) {
  
    const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button
        className="custom-color-button"
        style={{ backgroundColor: color, borderColor: color }}
        onClick={() => setOpen(true)}
      >
        Add New Requirement
      </button>

      <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <DialogTitle>Create Which Type of Requirement?</DialogTitle>
      <DialogContent>
        <p>
          You can create a <i>points</i> based requirement or a <i>percentage</i> based requirement. You can edit everything else about the requirement after it has been created.
        </p>
      </DialogContent>
      <DialogActions>
        <button autoFocus className="secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button onClick={() => {setOpen(false); createNewRequirement(true)}}>Points</button>
        <button onClick={() => {setOpen(false); createNewRequirement(false)}}>Percentage</button>
      </DialogActions>
    </Dialog>
    </div>
  );
}
