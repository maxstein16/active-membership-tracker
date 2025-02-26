import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";
import IconAndCaption from "./IconAndCaption";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import PersonIcon from "@mui/icons-material/Person";
import FaceIcon from "@mui/icons-material/Face";

export default function UserProfileData({ user }) {
  return (
    <div className="member-profile-wrapper">
      <h1>{user.name}</h1>
      <p>
        <b>{user.major}</b>
      </p>
      <p>
        Graduation Expected {user.gradMonth}, {user.gradYear}
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

      <a href={`mailto:${user.email}`}>{user.email}</a>
      <a href={`mailto:${user.personalEmail}`}>{user.personalEmail}</a>
      <p className="phone-num">{user.phone}</p>
    </div>
  );
}
