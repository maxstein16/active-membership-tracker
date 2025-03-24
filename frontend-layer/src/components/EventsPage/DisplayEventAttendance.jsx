import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import { CircularProgress } from "@mui/material";
import MemberTable from "../AdminPageComponents/MemberTable";
import { getAttendanceMemberData } from "../../utils/eventsCalls";

export default function DisplayEventAttendance({ orgId, color, event }) {
  const [attendanceMembers, setAttendanceMembers] = React.useState([]);

  React.useEffect(() => {
    getAttendanceMemberData(event).then((data) => {
      setAttendanceMembers(data);
    });
  }, [event]);

  return (
    <div style={{ marginTop: "2em" }}>
      {attendanceMembers.length === 0 ? (
        <p>No Attendees</p>
      ) : attendanceMembers ? (
        <>
          <p>To edit a member's points, click on their name and edit their membership. One point is awarded to each attendance (if your organization is point based) automatically</p>
          <MemberTable
            color={color}
            orgId={orgId}
            membersList={attendanceMembers}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
