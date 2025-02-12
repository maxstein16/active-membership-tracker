import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import { Link } from "react-router";
import useWindowWidth from "../../utils/useWindowWidth";


export default function NavigationDropdown() {

  const windowWidth = useWindowWidth();

  return (
      <div className={ windowWidth > 499 ? "navigation-dropdown columns" : "navigation-dropdown"}>
        <div>
          {/* TODO: get their organizations */}
          <Link to="/1/status">Wic</Link>
          {/* 
        <Link className="sub-link" to="/">Settings</Link>
        <Link className="sub-link" to="/">Reports</Link> 
        */}

          <Link to="/2/status">Comms</Link>
          {/* TODO: If they are a comms eboard for example */}
          <Link className="sub-link" to="/2/settings">
            Settings
          </Link>
          <Link className="sub-link" to="/2/reports">
            Reports
          </Link>
        </div>

        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Logout</Link>
        </div>

        {/* TODO: If they are a admin */}
        <div>
          <Link to="/createOrg">Create an Organization</Link>
          <Link to="/">Grant Privileges</Link>
        </div>
      </div>
  );
}
