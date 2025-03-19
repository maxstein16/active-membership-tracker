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

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(undefined);

  // Fetch user data on component mount
  React.useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const data = await getAPIData("/member", API_METHODS.GET);

        // Check if API response is successful
        if (data && data.data) {
          // Map the response data to state
          const member = data.data;
          setUserData({
            name: member.member_name,
            email: member.member_email,
            personalEmail: member.member_personal_email,
            phone: member.member_phone_number,
            major: member.member_major,
            gradMonth: new Date(member.member_graduation_date).toLocaleString(
              "default",
              { month: "long" }
            ),
            gradYear: new Date(member.member_graduation_date).getFullYear(),
            tshirt: member.member_tshirt_size,
            race: member.member_race,
            gender:
              member.member_gender === "F"
                ? "Female"
                : member.member_gender === "M"
                ? "Male"
                : member.member_gender,
            status: member.member_status,
            memberships: member.memberships.map((membership) => ({
              organizationName: membership.organization.organization_name,
              points: membership.membership_points,
              role: membership.membership_role,
              activeMember: membership.active_member,
            })),
          });
        } else {
          console.error(
            "Error fetching member data:",
            data?.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
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
      {!userData ? <CircularProgress /> : <UserProfileData user={userData} />}
    </PageSetup>
  );
}
