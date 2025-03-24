import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import { Link } from "react-router";
import useWindowWidth from "../../utils/useWindowWidth";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../utils/constants";
import { API_METHODS, getAPIData } from "../../utils/callAPI";
import displayErrors from "../../utils/displayErrors";
import { CircularProgress } from "@mui/material";

export default function NavigationDropdown() {
  const windowWidth = useWindowWidth();
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
        return;
      }

      // temp data
      let newData = {
        name: result.data.member_name,
        organizations: [],
      };

      const uniqueOrgs = new Map();
      
      let isAdminOfOneOrg = false;

      result.data.memberships.forEach((membership) => {
        const orgId = membership.organization.organization_id;
        
        if (!uniqueOrgs.has(orgId) || 
            (membership.membership_role === ROLE_ADMIN && uniqueOrgs.get(orgId).role !== ROLE_ADMIN)) {
          
          if (membership.membership_role === ROLE_ADMIN) {
            isAdminOfOneOrg = true;
          }
          
          uniqueOrgs.set(orgId, {
            id: orgId,
            abbreviation: membership.organization.organization_abbreviation,
            color: membership.organization.organization_color,
            role: membership.membership_role,
          });
        }
      });

      newData.organizations = Array.from(uniqueOrgs.values());

      setUserData(newData);
      setUserIsAdmin(isAdminOfOneOrg);
    });
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div
      className={
        windowWidth > 499
          ? "navigation-dropdown columns"
          : "navigation-dropdown"
      }
    >
      {error !== "" ? (
        <>{error}</>
      ) : !userData ? (
        <CircularProgress />
      ) : (
        <>
          <div>
            {userData.organizations.map((org, index) => {
              if (org.role === ROLE_MEMBER) {
                return <Link to={`/${org.id}/status`} key={index}>{org.abbreviation}</Link>;
              } else {
                return (
                  <div key={index}>
                    <Link to={`/${org.id}/status`}>{org.abbreviation}</Link>
                    <Link className="sub-link" to={`/${org.id}/settings`}>
                      Settings
                    </Link>
                    <Link className="sub-link" to={`/${org.id}/reports`}>
                      Reports
                    </Link>
                  </div>
                );
              }
            })}
          </div>

          <div>
            <Link to="/">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/logout" onClick={handleLogout} className="logout-link">Log out</Link>
          </div>

          {userIsAdmin ? (
            <div>
              <Link to="/createOrg">Create an Organization</Link>
              <Link to="/grantPrivilege">Grant Privileges</Link>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}