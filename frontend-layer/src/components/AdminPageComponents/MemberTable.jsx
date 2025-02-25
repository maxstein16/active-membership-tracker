import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";
import { getOrganizationMembers } from "../../utils/handleSettingsData";
import { CircularProgress } from "@mui/material";

/**
 * Give either an orgId or a members list
 */
export default function MemberTable({ orgId, membersList }) {
  // Store the members list as a state variable
  const [members, setMembers] = React.useState(undefined);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // if given members list, display it
    if (membersList) {
      setMembers(membersList);
    } else if (orgId) {
      // else if given org id, get all the members
      getOrganizationMembers(orgId).then((result) => {
        // console.log(result);
        if (!result.hasOwnProperty("error")) {
          setError("");
          setMembers(result);
        } else {
          setError("Error fetching your data. Contact Support");
        }
      });
    } else {
      // given nothing is not acceptable
      setError(
        "Error displaying members: must have either an org id or list of members"
      );
    }
  }, [orgId, membersList]);

  return (
    <div className="org-email-settings">
      <h2>Members</h2>
      {/* Display the members list in a MUI DataTable Component */}
      {error !== "" ? (
        <p>{error}</p>
      ) : !members ? (
        <CircularProgress />
      ) : (
        <p>{JSON.stringify(members)}</p>
      )}
    </div>
  );
}
