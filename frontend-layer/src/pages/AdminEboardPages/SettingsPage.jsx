import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import OrgSettingsBasicInfo from "../../components/AdminPageComponents/OrgSettingsBasicInfo";

export default function SettingsPage() {
  // Define my variables
  const { orgId } = useParams();
  const [orgData, setOrgData] = React.useState(undefined);

  // Get user data
  React.useEffect(() => {
    // TODO
    // get API data with org Id
    // set org data

    // temp data
    setOrgData({
      name: "Computing Organization for Multicultural Students",
      abbreviation: "COMMs",
      color: "#20BDE4",
      description:
        "Our Mission is to build a supportive community that celebrates the talent of underrepresented students in Computing. We work to accomplish our mission by providing mentorship, mental health awareness, and leadership opportunities.",
      threshold: 24,
      emailSettings: {
        id: 0,
        monthlyStatus: true,
        annual: false,
        semester: true,
        membershipAchieved: true,
      },
      membershipRequirements: [
        {
          id: 0,
          meetingType: "Meeting",
          frequency: "2x a Month",
          amountType: "points",
          amount: 1,
          requirementScope: "umm",
        },
        {
          id: 4,
          meetingType: "Volunteer",
          frequency: "2x a Month",
          amountType: "points",
          amount: 4,
          requirementScope: "umm",
        },
        {
          id: 10,
          meetingType: "Event",
          frequency: "2x a Month",
          amountType: "points",
          amount: 1,
          requirementScope: "umm",
        },
      ],
    });
  }, []);

  return (
    <PageSetup>
      <BackButton route={"/"} />
      {!orgData ? (
        <p>Error Fetching your Data</p>
      ) : (
        <>
          <h1>Settings Page</h1>
          <p>Org Id: {orgId}</p>
          <br />

          
          <OrgSettingsBasicInfo orgData={orgData} setOrgData={setOrgData}/>
        </>
      )}
    </PageSetup>
  );
}
