import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * Give a route OR areYouSure should be a setDialogOpen function
 */
export default function BackButton({route, areYouSure}) {

  const onBackButtonAction = () => {
    if (route) {
      navigate(route)
      return;
    } 
    areYouSure(true)
  }

  const navigate = useNavigate();

  return (
    <div className="back-button">
      <IconButton onClick={onBackButtonAction}>
        <ArrowBackIcon />
      </IconButton>
    </div>
  );
}
