import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import CustomColorToggle from "../CustomColorToggle";

export default function DisplayEmailSettings({ orgData, saveSetting }) {
  // define my variables
  const [isMonthlyOn, setIsMonthlyOn] = React.useState(
    orgData.emailSettings.monthlyStatus
  );
  const [isYearlyOn, setIsYearlyOn] = React.useState(
    orgData.emailSettings.annual
  );
  const [isSemesterlyOn, setIsSemesterlyOn] = React.useState(
    orgData.emailSettings.semester
  );
  const [isActiveAchievedOn, setIsActiveAchievedOn] = React.useState(
    orgData.emailSettings.membershipAchieved
  );

  return (
    <div className="org-email-settings">
      <h2>Email Settings</h2>

      {/* Monthly Status Update */}
      <CustomColorToggle
        label={"Monthly Status Update"}
        isChecked={isMonthlyOn}
        color={orgData.color}
        onChange={() => {
          setIsMonthlyOn(!isMonthlyOn);
          saveSetting(!isMonthlyOn, "monthlyStatus");
        }}
      />

      {/* Annual Org Update */}
      <CustomColorToggle
        label={"Annual Organization Update"}
        isChecked={isYearlyOn}
        color={orgData.color}
        onChange={() => {
          setIsYearlyOn(!isYearlyOn);
          saveSetting(!isYearlyOn, "annual");
        }}
      />

      {/* Semesterly Org Update */}
      <CustomColorToggle
        label={"Semester Organization Update"}
        isChecked={isSemesterlyOn}
        color={orgData.color}
        onChange={() => {
          setIsSemesterlyOn(!isSemesterlyOn);
          saveSetting(!isSemesterlyOn, "semester");
        }}
      />

      {/* Active Membership Achieved Update */}
      <CustomColorToggle
        label={"Active Membership Achieved Update"}
        isChecked={isActiveAchievedOn}
        color={orgData.color}
        onChange={() => {
          setIsActiveAchievedOn(!isActiveAchievedOn);
          saveSetting(!isActiveAchievedOn, "monthlyStatus");
        }}
      />
    </div>
  );
}
