import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";
import { getOrganizationMembers } from "../../utils/handleSettingsData";
import { CircularProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import displayErrors from "../../utils/displayErrors";

/**
 * Give either an orgId or a members list
 * 
 * FOR MEMBER LIST:
 * Must be in the same format that you get from the db:
 *  membership_id: 14,
    membership_role: 2,
    membership_points: 28,
    active_member: true,
    active_semesters: 1,
    member_id: 7,
    organization_id: 2,
    semester_id: 1123,
    member_name: "Gabriella Alvarez-Mcleod",
    member_email: "gma5228@rit.edu",
    member_major: "Human Computer Interaction",
    member_graduation_date: "2025-05-10T00:00:00.000Z",

    feel free to leave out any details that are NOT included in the table
 */
export default function MemberTable({ orgId, membersList }) {
  // Store the members list as a state variable
  const [members, setMembers] = React.useState(undefined);
  const [error, setError] = React.useState("");

  // GET THE DATA (if needed)
  React.useEffect(() => {
    // if given members list, display it
    if (membersList) {
      membersList.forEach((member, key) => {
        member.id = key + 1
      });
      setMembers(membersList);
    } else if (orgId) {
      // else if given org id, get all the members
      getOrganizationMembers(orgId).then((result) => {
        // console.log(result);
        if (result.hasOwnProperty("session")) {
          setError(displayErrors.noSession);
        } else if (!result.hasOwnProperty("error")) {
          setError("");
          result.forEach((member, key) => {
            member.id = key + 1
          });
          console.log(result)
          setMembers(result);
        } else {
          setError(displayErrors.errorFetchingContactSupport);
        }
      });
    } else {
      // given nothing is not acceptable
      setError(
        "Error displaying members: must have either an org id or list of members"
      );
    }
  }, [orgId, membersList]);

  /* {
    membership_id: 14,
    membership_role: 2,
    membership_points: 28,
    active_member: true,
    active_semesters: 1,
    member_id: 7,
    organization_id: 2,
    semester_id: 1123,
    member_name: "Gabriella Alvarez-Mcleod",
    member_email: "gma5228@rit.edu",
    member_major: "Human Computer Interaction",
    member_graduation_date: "2025-05-10T00:00:00.000Z",
  } */

  // TABLE INFO
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "member_name", headerName: "Name", width: 200 },
    
    // { field: "firstName", headerName: "First name", width: 130 },
    // { field: "lastName", headerName: "Last name", width: 130 },
    // {
    //   field: "age",
    //   headerName: "Age",
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) =>
    //     `${row.firstName || ""} ${row.lastName || ""}`,
    // },
  ];

  const paginationModel = { page: 0, pageSize: 15 };

  return (
    <div className="org-email-settings">
      <h2>Members</h2>
      {/* Display the members list in a MUI DataTable Component */}
      {error !== "" ? (
        <p>{error}</p>
      ) : !members ? (
        <CircularProgress />
      ) : (
        <p>{JSON.stringify(members, null, 2)}</p>
      )}
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          className="child-buttons-no-hover"
          rows={members}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15, 25, 50]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
