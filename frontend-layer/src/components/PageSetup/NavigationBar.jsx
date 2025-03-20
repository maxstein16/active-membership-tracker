import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NavigationBar({ toggleDropdown }) {
  const navigate = useNavigate();

  return (
    <div className="navigation-bar">
      <img
        src={require("../../assets/media/RIT_rgb_long_header.png")}
        alt="RIT, Rochester Institute of Technology"
        data-pin-no-hover="true"
        onClick={() => navigate("/")}
      />
      <div>
        <IconButton
          onClick={() => navigate("/profile")}
          className="nav-bar-button"
        >
          <AccountCircleIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </IconButton>
        <IconButton onClick={() => toggleDropdown()}>
          <MenuIcon sx={{ fontSize: 28, color: "#FFFFFF" }} />
        </IconButton>
      </div>
    </div>
  );
}
