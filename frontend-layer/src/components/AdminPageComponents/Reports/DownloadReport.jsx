import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

export default function DownloadReport({ color, classToDownload }) {
  const downloadReport = () => {
    // download a pdf of the report 
    // should take all the elements in the parent class given and put them in a pdf document
    // the document should download to the user's browser
  }
  return (
    <button
      className="custom-color-button"
      style={{ backgroundColor: color, borderColor: color }}
      onClick={downloadReport}
    >
      Download Report
    </button>
  );
}
