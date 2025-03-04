import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import {
  CircularProgress,
} from "@mui/material";
import MemberTable from "../AdminPageComponents/MemberTable";

export default function DisplayEventAttendance({ orgId, color, event }) {
  const [attendanceMembers, setAttendanceMembers] = React.useState(undefined);
  const [error, setError] = React.useState("TODO");

  React.useEffect(() => {
    
  }, []);

  return (
    <div style={{marginTop: '2em'}}>
      {error ? (
        <p className="error">{error}</p>
      ) : attendanceMembers ? (
        <MemberTable
          color={color}
          orgId={orgId}
          membersList={attendanceMembers}
        />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
