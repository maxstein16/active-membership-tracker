import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import OrgSettingsBasicInfo from "../../components/AdminPageComponents/OrgSettingsBasicInfo";
import DisplayEmailSettings from "../../components/AdminPageComponents/DisplayEmailSettings";
import DisplayMembershipRequirements from "../../components/AdminPageComponents/DisplayMembershipRequirements";
import MemberTable from "../../components/AdminPageComponents/MemberTable";

export default function SettingsPage() {
  // Define my variables
  // const { orgId } = useParams();
  const [orgData, setOrgData] = React.useState(undefined);

  // Get user data
  React.useEffect(() => {
    // TODO
    // get API data with org Id above, uncomment
    // set org data

    // temp data
    // DO NOT CHANGE THE LABELS OR FORMAT OF THIS DATA, it is used in MANY files
    // instead, format the api result to look like this
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
          frequency: "yearly",
          amountType: "points",
          amount: 1,
          requirementScope: "umm",
        },
        {
          id: 4,
          meetingType: "Volunteer",
          frequency: "semesterly",
          amountType: "points",
          amount: 4,
          requirementScope: "umm",
        },
        {
          id: 10,
          meetingType: "Event",
          frequency: "semesterly",
          amountType: "percent",
          amount: 50,
          requirementScope: "umm",
        },
      ],
    });
  }, []);

  /* Update Settings*/
  const saveBasicSetting = (newValue, valueName) => {
    // use the newValue variable to update the db (using getAPIdata method)

    // this can be done at the same time as the getAPIdata method is running
    // update the org data variable
    let newData = { ...orgData };
    newData[valueName] = newValue;
    setOrgData(newData);
    console.log(newData);
  };

  const saveEmailSetting = (newValue, valueName) => {
    // use the newValue variable to update the db (using getAPIdata method)
    
    // this can be done at the same time as the getAPIdata method is running
    // update the org data variable
    let newData = { ...orgData };
    newData.emailSettings[valueName] = newValue;
    setOrgData(newData);
    console.log(newData);
  };

  const updateValueInDB = (newValue, reqId, valueName) => {
    // update a value for a membership requirement in the db
      // example param values: '3' '39' 'amount'
  };
  const deleteRequirementInDB = (reqId) => {
    // delete the requirement by reqId in the databse
  };

  return (
    <PageSetup>
      <BackButton route={"/"} />
      {!orgData ? (
        <p>Error Fetching your Data</p>
      ) : (
        <>
          <h1>Settings</h1>
          <p>Data is automatically saved after you enter it</p>
          <br />

          <OrgSettingsBasicInfo orgData={orgData} saveData={saveBasicSetting} />
          <DisplayEmailSettings orgData={orgData} saveData={saveEmailSetting} />
          <DisplayMembershipRequirements
            color={orgData.color}
            orgData={orgData}
            setOrgData={setOrgData}
            updateValueInDB={updateValueInDB}
            deleteRequirementInDB={deleteRequirementInDB}
          />

          <MemberTable />
        </>
      )}
    </PageSetup>
  );
}
