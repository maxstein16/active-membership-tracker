import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";
import { getOrganizationMembers } from "../../utils/handleSettingsData";
import { CircularProgress, Paper } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';


/**
 * Give either an orgId or a members list
 */
export default function MemberTable({ orgId, membersList }) {
  // Store the members list as a state variable
  const [members, setMembers] = React.useState(undefined);
  const [error, setError] = React.useState("");

  // GET THE DATA (if needed)
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


  // TABLE INFO
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
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
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15, 25, 50]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
