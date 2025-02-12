import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import PageSetup from "../components/PageSetup/PageSetup";
import OrgBox from "../components/MemberPageComponents/OrgBox";
import { ROLE_MEMBER } from "../utils/constants";
import { Link } from "react-router";

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
          id: 0,
          abbreviation: "WiC",
          color: "#381A58",
          role: 0,
        },
        {
          id: 3,
          abbreviation: "Comms",
          color: "#20BDE4",
          role: 1,
        },
      ],
    });

    // if a user is an admin of any org
    setUserIsAdmin(true);
  }, []);

  return (
    <PageSetup>
      {!userData ? (
        <p>Error fetching your data</p>
      ) : (
        <>
          <h1>Welcome, {userData.name}</h1>{" "}
          <div className="org-boxes">
            {userData.organizations.map((organization) => {
              if (organization.role !== ROLE_MEMBER) {
                return (
                  <div className="org-box-with-admin-links">
                    <OrgBox org={organization} />
                    <Link to={`/${organization.id}/settings`}>Settings</Link>
                    <Link to={`/${organization.id}/reports`}>Reports</Link>
                  </div>
                );
              }
              return <OrgBox org={organization} />;
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
