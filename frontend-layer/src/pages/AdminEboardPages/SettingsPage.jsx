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
import CreateNewRequirement from "../../components/AdminPageComponents/Settings/CreateNewRequirement";
import MemberTable from "../../components/AdminPageComponents/MemberTable";
import { CircularProgress } from "@mui/material";
import {
  createNewMembershipRequirementInDB,
  deleteMemberRequirement,
  getOrganizationSettingsData,
  saveEmailSettingInDB,
  saveInfoSetting,
  saveMembershipRequirementDetail,
} from "../../utils/handleSettingsData";
import { useParams } from "react-router";
import displayErrors from "../../utils/displayErrors";

export default function SettingsPage() {
  // Define my variables
  const { orgId } = useParams();
  const [orgData, setOrgData] = React.useState(undefined);
  const [error, setError] = React.useState("");

  // Get user data
  React.useEffect(() => {
    // get API data with orgId - format it to the frontend org format
    getOrganizationSettingsData(orgId).then((result) => {
      // console.log(result)
      if (result.hasOwnProperty("session")) {
        setError(displayErrors.noSession);
      } else if (!result.hasOwnProperty("error")) {
        setError("");
        setOrgData(result);
      } else {
        setError(displayErrors.errorFetchingContactSupport);
      }
    });
  }, [orgId]);

  /* Update Settings*/
  const saveBasicSetting = (newValue, valueName) => {
    // use the newValue variable to update the db (using getAPIdata method)
    saveInfoSetting(orgId, newValue, valueName).then((success) => {
      if (!success) {
        setError(displayErrors.somethingWentWrong);
      }
    });
    // this can be done at the same time as the getAPIdata method is running
    // update the org data variable
    let newData = { ...orgData };
    newData[valueName] = newValue;
    setOrgData(newData);
    // console.log(newData);
  };

  const saveEmailSetting = (newValue, valueName) => {
    // use the newValue variable to update the db (using getAPIdata method)
    saveEmailSettingInDB(orgId, newValue, valueName).then((success) => {
      if (!success) {
        setError(displayErrors.somethingWentWrong);
      }
    });
    // this can be done at the same time as the getAPIdata method is running
    // update the org data variable
    let newData = { ...orgData };
    newData.emailSettings[valueName] = newValue;
    setOrgData(newData);
    // console.log(newData);
  };

  const updateValueInDB = (newValue, reqId, valueName) => {
    // update a value for a membership requirement in the db
    // example param values: '3' '39' 'amount'
    saveMembershipRequirementDetail(orgId, reqId, newValue, valueName).then(
      (success) => {
        if (!success) {
          setError(displayErrors.somethingWentWrong);
        }
      }
    );
  };
  const deleteRequirementInDB = (reqId) => {
    // delete the requirement by reqId in the database
    deleteMemberRequirement(orgId, reqId).then((success) => {
      if (!success) {
        setError(displayErrors.somethingWentWrong);
      }
    });
  };

  const createNewRequirement = (isPoints) => {
    // create the requirement in the database
    createNewMembershipRequirementInDB(orgId, isPoints).then((success) => {
      if (success.hasOwnProperty("session")) {
        setError(displayErrors.noSession);
      }
      if (!success) {
        setError(displayErrors.somethingWentWrong);
        return;
      }
      // add to orgData variable to display without reload
      let newData = { ...orgData };
      newData.membershipRequirements.push({
        id: success.requirement_id,
        meetingType: success.meeting_type,
        frequency: success.frequency,
        amountType: success.amountType,
        amount: success.amount,
        requirementScope: success.requirement_scope
      })
      setOrgData(newData);
    });
  };

  return (
    <PageSetup>
      <BackButton route={"/"} />
      {error !== "" ? (
        <p className="error">{error}</p>
      ) : !orgData ? (
        <CircularProgress />
      ) : (
        <>
          <h1>Settings</h1>
          <p>Data is automatically saved after you enter it</p>
          <br />

          <OrgSettingsBasicInfo
            orgData={orgData}
            saveSetting={saveBasicSetting}
          />
          <DisplayEmailSettings
            orgData={orgData}
            saveSetting={saveEmailSetting}
          />
          <DisplayMembershipRequirements
            color={orgData.color}
            orgData={orgData}
            setOrgData={setOrgData}
            updateValueInDB={updateValueInDB}
            deleteRequirementInDB={deleteRequirementInDB}
          />
          <CreateNewRequirement
            color={orgData.color}
            createNewRequirement={createNewRequirement}
          />

          <MemberTable color={orgData.color} orgId={orgId} />
        </>
      )}
    </PageSetup>
  );
}
