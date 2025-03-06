import * as React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { API_METHODS, getAPIData } from "../../utils/callAPI";

export default function UploadDataModal({ orgId, open, setOpen }) {
  console.log(
    `UploadDataModal says: orgId - ${orgId}, open - ${open}, setOpen - ${setOpen}`
  );

  const [fileSelected, setFileSelected] = React.useState(false);
  const [fileName, setFileName] = React.useState(""); // State for file name
  const [fileContent, setFileContent] = React.useState(""); // State for file content
  const [errMsg, setErrMsg] = React.useState(""); // State for error message
  const navigate = useNavigate(); // React Router navigate function

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setFileSelected(true);
      setFileName(file.name); // Set the file name
      readFileContent(file); // Read file content
    } else {
      setFileSelected(false);
    }
  };

  // Read the content of the file
  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result); // Set the file content
      console.log(reader.result);
    };
    reader.readAsText(file); // Read file as text (CSV content)
  };

  const handleUpload = async () => {
    setErrMsg("");

    if (!fileSelected) {
      console.log("Upload first!");
      return;
    }

    console.log("Uploading file...");
    const fileInput = document.querySelector("input[type='file']");

    if (!fileInput.files.length) {
      console.error("No file selected!");
      setErrMsg("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const result = await getAPIData(
        `/organization/${orgId}/upload`,
        API_METHODS.post,
        formData,
        true // Indicate that this is FormData
      );

      if (!result) {
        setErrMsg("Could not post/upload the file.");
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
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>Upload CSV Data File</DialogTitle>
      <DialogContent>
        <p>
          You can find CSV data files on campus groups, or you can upload your
          own data files. Make sure you follow the same format as campus groups
          :)
        </p>
        <input type="file" onChange={handleFileChange} />
        {fileName && <p>File selected: {fileName}</p>} {/* Display file name */}
        {fileContent && (
          <p>File Content Preview: {fileContent.slice(0, 100)}</p>
        )}{" "}
        {/* Display file content preview */}
        {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}{" "}
        {/* Display error message */}
      </DialogContent>
      <DialogActions>
        <button autoFocus className="secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!fileSelected} // Disables button until a file is selected
        >
          Upload
        </button>
      </DialogActions>
    </Dialog>
  );
}
