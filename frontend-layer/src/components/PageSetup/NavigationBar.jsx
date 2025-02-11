import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from "@mui/material";

export default function NavigationBar() {
  return (
    <div className="navigation-bar">
      <img
        src={require("../../assets/media/RIT_rgb_long_header.png")}
        alt="RIT, Rochester Institute of Technology"
        data-pin-no-hover="true"
      />
      <div>
        <IconButton onClick={() => console.log("Account Pressed")}>
          <AccountCircleIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <IconButton onClick={() => console.log("Menu Pressed")}>
          <MenuIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </div>
    </div>
  );
}
