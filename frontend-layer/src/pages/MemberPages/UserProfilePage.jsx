import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import BottomCornerButton from "../../components/BottomCornerButton";
import EditIcon from "@mui/icons-material/Edit";
import UserProfileData from "../../components/MemberPageComponents/UserProfileData";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function UserProfilePage() {
  // Define my variables
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(undefined);

  // Get user data
  React.useEffect(() => {
    // TODO
    // get API data
    // set user data

    // temp data
    setUserData({
      name: "Name Here",
      email: "email@rit.edu",
      personalEmail: "email@gmail.com",
      phone: "(111) 111 - 1111",
      major: "Major, BS",
      gradMonth: "Month",
      gradYear: "year",
      tshirt: "Medium",
      race: "White",
      gender: "Woman"
    });
  }, []);

  return (
    <PageSetup>
      <BackButton route={"/"}/>
      <BottomCornerButton
        action={() => {
          navigate("/profile/edit");
        }}
      >
        <EditIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
      </BottomCornerButton>

      {!userData ? (
        <CircularProgress/>
      ) : (
        <UserProfileData user={userData} />
      )}
    </PageSetup>
  );
}
