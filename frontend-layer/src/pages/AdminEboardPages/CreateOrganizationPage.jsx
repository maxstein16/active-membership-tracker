import * as React from "react";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import OrgSettingsBasicInfo from "../../components/AdminPageComponents/OrgSettingsBasicInfo";
import DisplayEmailSettings from "../../components/AdminPageComponents/DisplayEmailSettings";
import DisplayMembershipRequirements from "../../components/AdminPageComponents/DisplayMembershipRequirements";
import CreateNewRequirement from "../../components/AdminPageComponents/CreateNewRequirement";

export default function CreateOrganizationPage() {
  // default values of org data - don't remove or change
  const [orgData, setOrgData] = React.useState({
    name: "",
    abbreviation: "",
    description: "",
    color: "#F76902", // default value, don't remove
    threshold: "",
    emailSettings: {
      id: 0,
      monthlyStatus: true,
      annual: true,
      semester: true,
      membershipAchieved: true,
    },
    membershipRequirements: [],
  });

  // Functions
  const saveDataLocally = (newValue, valueName, type) => {
    // update the org data variable
    let newData = { ...orgData };
    if (type === "email") {
      newData.emailSettings[valueName] = newValue;
    } else if (type === "membershipReqs") {
      newData.membershipRequirements[valueName] = newValue;
    } else {
      newData[valueName] = newValue;
    }
    setOrgData(newData);
    console.log(newData);
  };

  return (
    <PageSetup>
      <BackButton route={"/"} />

      <h1>Create Organization Page</h1>
      <p>
        You will be added as the admin of this organization. You can not be
        removed as an admin until there is at least one more admin.
      </p>

      <OrgSettingsBasicInfo
        orgData={orgData}
        saveSetting={(newValue, valueName) =>
          saveDataLocally(newValue, valueName, "basic")
        }
      />
      <DisplayEmailSettings
        orgData={orgData}
        saveSetting={(newValue, valueName) =>
          saveDataLocally(newValue, valueName, "email")
        }
      />
      <DisplayMembershipRequirements
        color={orgData.color}
        orgData={orgData}
        setOrgData={setOrgData}
        updateValueInDB={() => {
          /* Don't need to do anything here */
        }}
        deleteRequirementInDB={() => {
          /* Don't need to do anything here */
        }}
      />
      <CreateNewRequirement
        color={orgData.color}
        createNewRequirement={() => {}}
      />

      {/* When clicked: cancel needs to have an are you sure popup,  */}
      <div className="create-org-buttons">
        <button className="secondary">Cancel</button>
        <button>Create Organization</button>
      </div>
    </PageSetup>
  );
}
