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
      }

      // temp data
      let newData = {
        name: result.data.member_name,
        organizations: [],
      };

      // if a user is an admin of any org
      let isAdminOfOneOrg = false;

      result.data.memberships.forEach((membership) => {
        if (membership.membership_role === ROLE_ADMIN) {
          isAdminOfOneOrg = true;
        }
        newData.organizations.push({
          id: membership.organization.organization_id,
          abbreviation: membership.organization.organization_abbreviation,
          color: membership.organization.organization_color,
          role: membership.membership_role,
        });
      });

      // set the state variables
      setUserData(newData);
      setUserIsAdmin(isAdminOfOneOrg);
    });
  }, []);

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
            {/* TODO: get their organizations */}
            {userData.organizations.map((org) => {
              if (org.role === ROLE_MEMBER) {
                return <Link to={`/${org.id}/status`}>{org.abbreviation}</Link>;
              } else {
                return (
                  <>
                    <Link to={`/${org.id}/status`}>{org.abbreviation}</Link>
                    <Link className="sub-link" to={`/${org.id}/settings`}>
                      Settings
                    </Link>
                    <Link className="sub-link" to={`/${org.id}/reports`}>
                      Reports
                    </Link>
                  </>
                );
              }
            })}
          </div>

          <div>
            <Link to="/">Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </div>

          {/* TODO: If they are a admin */}
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
