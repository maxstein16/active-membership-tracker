import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function UploadDataModal({ orgId, color }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      {/* Upload Data Link + Popup */}
      <button
        onClick={() => setOpen(true)}
        style={{ color: color, borderColor: color }}
        className="secondary custom-color-button"
      >
        Upload Attendance Data
      </button>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <DialogTitle>Upload CSV Data File</DialogTitle>
        <DialogContent>
          <p>
            You can find CSV data files on campus groups, or you can upload your
            own data files. Make sure you follow the same format as campus
            groups :)
          </p>
          <input type="file" />
        </DialogContent>
        <DialogActions>
          <button
            autoFocus
            className="secondary custom-color-button"
            style={{color: color, borderColor: color}}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{backgroundColor: color, borderColor: color}}
            className="custom-color-button"
          >
            Upload
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
