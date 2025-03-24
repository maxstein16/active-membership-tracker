import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import OrgSettingsBasicInfo from "../../components/AdminPageComponents/Settings/OrgSettingsBasicInfo";
import DisplayEmailSettings from "../../components/AdminPageComponents/Settings/DisplayEmailSettings";
import DisplayMembershipRequirements from "../../components/AdminPageComponents/Settings/DisplayMembershipRequirements";
import { createNewOrgInDB } from "../../utils/createNewOrg";
import SuccessDialog from "../../components/SuccessDialog";
import AreYouSure from "../../components/AreYouSure";

export default function CreateOrganizationPage() {
  const [error, setError] = React.useState("");
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [showAreYouSureDialog, setShowAreYouSureDialog] = React.useState(false);

  // default values of org data - don't remove or change
  const [orgData, setOrgData] = React.useState({
    name: "",
    abbreviation: "",
    description: "",
    email: "",
    color: "#F76902", // default value, don't remove
    threshold: "",
    isPointBased: true,
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
      if (valueName === "isPointBased") {
        newData.membershipRequirements = []
      }
    }
    setOrgData(newData);
  };

  const createNewRequirementLocally = () => {
    // get the last requirement's id so we can increment
    let lastId = 0;
    let len = orgData.membershipRequirements.length;
    if (len >= 1) {
      lastId = orgData.membershipRequirements[len - 1].id;
    }
    let newData = { ...orgData };
    newData.membershipRequirements.push({
      id: lastId + 1, // create a FRONTEND ONLY id
      eventType: "general meeting",
      type: orgData.isPointBased ? "points" : "attendance_count",
      value: 1,
      bonuses: [],
    });

    setOrgData(newData);
  };

  const createNewBonusLocally = (reqId) => {

    // get the last requirement's id so we can increment
    let lastId = 0;
    let requirement = orgData.membershipRequirements.filter((req) => req.id === reqId)
    let len = requirement[0].bonuses.length;
    if (len >= 1) {
      lastId = requirement[0].bonuses[len - 1].id;
    }

    let newData = { ...orgData };
    newData.membershipRequirements.forEach((requirement, index) => {
      if (requirement.id === reqId) {
        newData.membershipRequirements[index].bonuses.push({
          id: lastId + 1, // create a FRONTEND ONLY id
          threshold: 50,
          points: 1,
        });
      }
    })

    setOrgData(newData);
  };

  const cancel = () => {
    setShowAreYouSureDialog(true);
  };

  const createOrg = () => {
    createNewOrgInDB(orgData).then((error) => {
      if (!error) {
        // success!
        setShowSuccessDialog(true);
        return;
      }
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setError(error);
    });
  };

  return (
    <PageSetup>
      <BackButton areYouSure={setShowAreYouSureDialog} />

      {error !== "" ? <p className="error">{error}</p> : <></>}
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
        deleteBonusRequirementInDb={() => {
          /* Don't need to do anything here */
        }}
        createNewRequirement={createNewRequirementLocally}
        createNewBonus={createNewBonusLocally}
      />

      {error !== "" ? (
        <p className="error" style={{ marginTop: "40px" }}>
          {error}
        </p>
      ) : (
        <></>
      )}
      {/* When clicked: cancel needs to have an are you sure popup,  */}
      <div className="create-org-buttons">
        <button className="secondary" onClick={cancel}>
          Cancel
        </button>
        <button onClick={createOrg}>Create Organization</button>
      </div>
      <SuccessDialog open={showSuccessDialog} setOpen={setShowSuccessDialog} />
      <AreYouSure
        open={showAreYouSureDialog}
        setOpen={setShowAreYouSureDialog}
        navLink={"/"}
      />
    </PageSetup>
  );
}
