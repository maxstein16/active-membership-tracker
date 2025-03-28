import * as React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { API_METHODS, getAPIData } from "../../utils/callAPI";
export default function UploadDataModal({ orgId, eventId, color }) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [errMsg, setErrMsg] = React.useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Get file
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const handleUpload = async () => {
    setErrMsg("");

    if (!file) {
      // ✅ Fixed variable name
      console.log("Upload first!");
      setErrMsg("Please select a file to upload.");
      return;
    }

    console.log("Uploading file...");

    const formData = new FormData();
    formData.append("file", file); // ✅ Now correctly referencing the file

    try {
      console.log(
        `Trying to gtAPIData for /organization/${orgId}/event/${eventId}/upload-csv`
      );

      // Debugging: Log what is actually in FormData
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const result = await getAPIData(
        `/organization/${orgId}/event/${eventId}/upload-csv`,
        API_METHODS.post,
        formData,
        true
      );

      console.log("Server response:", result);

      // ✅ Handle possible non-JSON response gracefully
      if (!result || typeof result !== "object") {
        setErrMsg("Upload completed, but no JSON response was received.");
        return;
      }

      if (result.status === "success") {
        setOpen(false);
        navigate("/");
      } else {
        setErrMsg(result.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Error during file upload:", err);
      setErrMsg("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{ color: color, borderColor: color }}
        className="secondary custom-color-button"
      >
        Upload Attendance Data
      </button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Upload CSV Data File</DialogTitle>
        <DialogContent>
          <p>
            You can find CSV data files on campus groups, or you can upload your
            own data files. Make sure you follow the same format as campus
            groups :)
          </p>
          <input type="file" onChange={handleFileChange} />
          {fileName && <p>Selected file: {fileName}</p>}
          {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
        </DialogContent>
        <DialogActions>
          <button
            autoFocus
            className="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button onClick={handleUpload} disabled={!file}>
            Upload
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
