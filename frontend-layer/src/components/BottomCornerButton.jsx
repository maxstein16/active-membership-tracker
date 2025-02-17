import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";
import { IconButton } from "@mui/material";

export default function BottomCornerButton({ action, children }) {
  return (
    <div className="bottom-corner-button">
      <IconButton onClick={action}>
        {children}
      </IconButton>
    </div>
  );
}
