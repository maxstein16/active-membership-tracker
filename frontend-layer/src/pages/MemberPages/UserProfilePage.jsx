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
import { API_METHODS, getAPIData } from "../../utils/callAPI";
import { CircularProgress } from "@mui/material";
import displayErrors from "../../utils/displayErrors";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(undefined);
  const [error, setError] = React.useState("");

  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchMemberData = async () => {
      const data = await getAPIData("/member", API_METHODS.get, {});

      // Check if API response is successful
      if (!data || !data.hasOwnProperty("data")) {
        console.error("Error fetching member data:", data);
        setError(displayErrors.errorFetchingContactSupport);
      }

      // Map the response data to state
      const member = data.data;
      setUserData({
        name: member.member_name ?? "",
        email: member.member_email ?? "",
        personalEmail: member.member_personal_email ?? "",
        phone: member.member_phone_number ?? "",
        major: member.member_major ?? "",
        gradMonth: new Date(
          member.member_graduation_date ??
            `${new Date().getFullYear()}-05-10 00:00:00`
        ).getMonth(),
        gradYear: new Date(
          member.member_graduation_date ??
            `${new Date().getFullYear()}-05-10 00:00:00`
        ).getFullYear(),
        tshirt: member.member_tshirt_size ?? "",
        race: member.member_race ?? "",
        gender: member.member_gender ?? "",
        status: member.member_status ?? "",
      });
    };

    fetchMemberData();
  }, []);

  return (
    <PageSetup>
      <BackButton route={"/"} />
      <BottomCornerButton
        action={() => {
          navigate("/profile/edit");
        }}
      >
        <EditIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
      </BottomCornerButton>

      {/* Render CircularProgress if data is still loading */}
      {error !== "" ? <p>{error}</p> : !userData ? <CircularProgress /> : <UserProfileData user={userData} />}
    </PageSetup>
  );
}
