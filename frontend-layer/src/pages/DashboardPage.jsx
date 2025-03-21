import * as React from "react";
import "../assets/css/constants.css";
import "../assets/css/pageSetup.css";
import "../assets/css/general.css";
import "../assets/css/memberPages.css";

import PageSetup from "../components/PageSetup/PageSetup";
import { Link } from "react-router";
import OrgBoxWithAdminLinks from "../components/AdminPageComponents/OrgBoxWithAdminLinks";
import { CircularProgress } from "@mui/material";
import displayErrors from "../utils/displayErrors";
import { API_METHODS, getAPIData } from "../utils/callAPI";
import { ROLE_ADMIN } from "../utils/constants";

export default function DashboardPage() {
  // Define my variables
  const [userData, setUserData] = React.useState(undefined);
  const [userIsAdmin, setUserIsAdmin] = React.useState(false);
  const [error, setError] = React.useState("");

  // Get user data
  React.useEffect(() => {
    // get API data
    setError("");
    getAPIData(`/member`, API_METHODS.get, {}).then((result) => {
      // set user data
      if (!result || result.hasOwnProperty("error")) {
        setError(displayErrors.errorFetchingContactSupport);
      }

      // temp data
      let newData = {
        name: result.data.member_name,
        organizations: [],
      };

      // if a user is an admin of any org
      let isAdminOfOneOrg = false

      result.data.memberships.forEach((membership) => {
          if (membership.membership_role === ROLE_ADMIN) {
            isAdminOfOneOrg = true
          }
          newData.organizations.push({
            id: membership.organization.organization_id,
            abbreviation: membership.organization.organization_abbreviation,
            color: membership.organization.organization_color,
            role: membership.membership_role
          })
      })

      // set the state variables
      setUserData(newData)
      setUserIsAdmin(isAdminOfOneOrg);
    });
  }, []);

  return (
    <PageSetup meData={userData}>
      {error !== "" ? (
        <p>{error}</p>
      ) : !userData ? (
        <CircularProgress />
      ) : (
        <>
          <h1>Welcome, {userData.name}</h1>{" "}
          <div className="org-boxes">
            {userData.organizations.map((organization, key) => {
              // In here there is a check for role
              return (
                <OrgBoxWithAdminLinks organization={organization} key={key} />
              );
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
          {userIsAdmin ? (
            <Link to="/createOrg">
              <button>Create A New Organization</button>
            </Link>
          ) : (
            <></>
          )}
        </>
      )}
    </PageSetup>
  );
}
