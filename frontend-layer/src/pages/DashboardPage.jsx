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
  const [userData, setUserData] = React.useState(undefined);
  const [userIsAdmin, setUserIsAdmin] = React.useState(false);
  const [error, setError] = React.useState("");

  // Auto-login session check using getAPIData
  React.useEffect(() => {
    getAPIData(`/session`, API_METHODS.get, {}).then((sessionData) => {
      if (!sessionData || sessionData.hasOwnProperty("error")) {
        // No session, so login
        // console.log("No session, logging in...");
        getAPIData(`/session/login`, API_METHODS.get, {}).then((loginResult) => {
          // console.log("Login result:", loginResult);
        });
      } else {
        // console.log("Session data:", sessionData);
      }
    });
  }, []);

  // Fetch member data
  React.useEffect(() => {
    setError("");
    getAPIData(`/member`, API_METHODS.get, {}).then((result) => {
      if (!result || result.hasOwnProperty("error")) {
        setError(displayErrors.errorFetchingContactSupport);
        return;
      }

      let newData = {
        name: result.data.member_name,
        organizations: [],
      };

      let isAdminOfOneOrg = false;

      const uniqueOrganizations = new Map();
      
      result.data.memberships.forEach((membership) => {
        const orgId = membership.organization.organization_id;
        
        if (!uniqueOrganizations.has(orgId)) {
          uniqueOrganizations.set(orgId, {
            id: orgId,
            abbreviation: membership.organization.organization_abbreviation,
            color: membership.organization.organization_color,
            role: membership.membership_role,
          });
          
          if (membership.membership_role === ROLE_ADMIN) {
            isAdminOfOneOrg = true;
          }
        }
      });

      newData.organizations = Array.from(uniqueOrganizations.values());

      setUserData(newData);
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
