import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({route}) {
  const navigate = useNavigate();

  return (
    <div className="back-button">
      <IconButton onClick={() => navigate(route)}>
        <ArrowBackIcon />
      </IconButton>
    </div>
  );
}
