import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";
import { getOrganizationMembers } from "../../utils/handleSettingsData";
import { CircularProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import displayErrors from "../../utils/displayErrors";
import { ROLE_ADMIN, ROLE_EBOARD } from "../../utils/constants";
import MemberPopUpInfo from "./MemberPopUpInfo";

/**
 * Give either an orgId or a members list to display and org id to get membership data
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
export default function MemberTable({ color, orgId, membersList }) {
  // Store the members list as a state variable
  const [members, setMembers] = React.useState(undefined);
  const [error, setError] = React.useState("");

  // stuff for popup
  const [popUpOpen, setPopUpOpen] = React.useState(false);
  const [memberId, setMemberId] = React.useState(undefined);
  const [memberShipId, setMemberShipId] = React.useState(undefined);

  // GET THE DATA (if needed)
  const fetchMembers = React.useCallback(async () => {
    // if given members list, display it
    if (membersList) {
      membersList.forEach((member, key) => {
        member.id = key + 1;
      });
      setMembers(membersList);
    } else if (orgId) {
      // else if given org id, get all the members
      const result = await getOrganizationMembers(orgId);
      // console.log(result);
      if (result.hasOwnProperty("session")) {
        setError(displayErrors.noSession);
      } else if (!result.hasOwnProperty("error")) {
        setError("");
        result.forEach((member, key) => {
          member.id = key + 1;
        });
        setMembers(result);
      } else {
        setError(displayErrors.errorFetchingContactSupport);
      }
    } else {
      // given nothing is not acceptable
      setError(
        "Error displaying members: must have either an [org id] or [list of members and org id]"
      );
    }
  }, [orgId, membersList]);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // TABLE INFO
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "member_name", headerName: "Name", width: 200 },
    { field: "member_email", headerName: "Email", width: 150 },
    {
      field: "membership_role",
      headerName: "Role",
      width: 120,
      valueGetter: (value, row) =>
        row.membership_role === ROLE_ADMIN
          ? "Admin"
          : row.membership_role === ROLE_EBOARD
          ? "Eboard"
          : "Member",
    },
    {
      field: "active_member",
      headerName: "Active?",
      width: 120,
      valueGetter: (value, row) => (row.active_member ? "Yes" : "No"),
    },
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
        <>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              className="child-buttons-no-hover"
              rows={members}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10, 15, 25, 50]}
              sx={{
                border: 0,
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: `${color}33`,
                },
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus":
                  {
                    outline: "none",
                  },
                "& .Mui-selected": {
                  backgroundColor: `${color}11 !important`,
                },
              }}
              onRowClick={(event) => {
                setPopUpOpen(true);
                setMemberId(event.row.member_id);
                setMemberShipId(event.row.membership_id);
              }}
            />
          </Paper>
          <MemberPopUpInfo
            color={color}
            open={popUpOpen}
            setOpen={setPopUpOpen}
            orgId={orgId}
            memberId={memberId}
            membershipId={memberShipId}
            refreshMembers={fetchMembers}
          />
        </>
      )}
    </div>
  );
}
