import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function UploadDataModal({ orgId, open, setOpen }) {
  const [fileSelected, setFileSelected] = React.useState(false);

  const handleFileChange = (event) => {
    setFileSelected(event.target.files.length > 0);
  };

  return (
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
          own data files. Make sure you follow the same format as campus groups
          :)
        </p>
        <input type="file" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <button autoFocus className="secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button
          onClick={() => {
            if (fileSelected) {
              console.log("Uploading file...");
              // Implement actual upload logic here
            } else {
              console.log("Upload first!");
            }
          }}
          disabled={!fileSelected} // Disables button until a file is selected
        >
          Upload
        </button>
      </DialogActions>
    </Dialog>
  );
}
