import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import PageSetup from "../components/PageSetup/PageSetup";
import { Link } from "react-router";
import OrgBoxWithAdminLinks from "../components/AdminPageComponents/OrgBoxWithAdminLinks";
import { CircularProgress } from "@mui/material";

export default function DashboardPage() {
  // Define my variables
  const [userData, setUserData] = React.useState(undefined);
  const [userIsAdmin, setUserIsAdmin] = React.useState(false);

  // Get user data
  React.useEffect(() => {
    // TODO
    // get API data
    // set user data

    // temp data
    setUserData({
      name: "Name Here",
      organizations: [
        {
          id: 1,
          abbreviation: "WiC",
          color: "#381A58",
          role: 2,
        },
        {
          id: 2,
          abbreviation: "COMS",
          color: "#20BDE4",
          role: 2,
        },
      ],
    });

    // if a user is an admin of any org
    setUserIsAdmin(true);
  }, []);

  return (
    <PageSetup>
      {!userData ? (
        <CircularProgress/>
      ) : (
        <>
          <h1>Welcome, {userData.name}</h1>{" "}
          <div className="org-boxes">
            {userData.organizations.map((organization, key) => {
              // In here there is a check for role
              return <OrgBoxWithAdminLinks organization={organization} key={key}/>
            })}
          </div>
          <div className="how-to-add-org-block">
            <h3>How to add Organizations</h3>
            <p>
              Join a participating organization on campus group, and go to one
              of their events. After that, it will automatically show up on your
              dashboard.
            </p>
          </div>
          {userIsAdmin ? <Link to="/createOrg"><button>Create A New Organization</button></Link> : <></>}
        </>
      )}
    </PageSetup>
  );
}
