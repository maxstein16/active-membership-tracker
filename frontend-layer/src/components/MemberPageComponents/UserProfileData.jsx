import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import IconAndCaption from "./IconAndCaption";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import PersonIcon from "@mui/icons-material/Person";
import FaceIcon from "@mui/icons-material/Face";

export default function UserProfileData({ user, hideName, color }) {
  // Month number to name mapping
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthIndex = parseInt(user.gradMonth, 10) - 1;
  let monthName =
    !isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12
      ? monthNames[monthIndex]
      : "Unknown";

  const contactStyle = color ? { color: color, fontWeight: "bold" } : {};

  return (
    <div className="member-profile-wrapper">
      {hideName !== true && <h1>{user.name}</h1>}

      <p>
        <b>{user.major}</b>
      </p>
      <p>
        Graduation Expected {monthName} {user.gradYear || "Unknown"}
      </p>

      <div className="icon-data">
        <IconAndCaption caption={user.tshirt}>
          <CheckroomIcon />
        </IconAndCaption>
        <IconAndCaption caption={user.race}>
          <FaceIcon />
        </IconAndCaption>
        <IconAndCaption caption={user.gender}>
          <PersonIcon />
        </IconAndCaption>
      </div>

      <hr />

      <a href={`mailto:${user.email}`} style={contactStyle}>
        {user.email}
      </a>
      <a href={`mailto:${user.personalEmail}`} style={contactStyle}>
        {user.personalEmail}
      </a>
      <p className="phone-num" style={contactStyle}>
        {user.phone}
      </p>
    </div>
  );
}
