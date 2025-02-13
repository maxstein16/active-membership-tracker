import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import MembershipRequirementLine from "./MemberRequirementLine";

export default function DisplayMembershipRequirements({
  color,
  orgData,
  setOrgData,
  updateValueInDB, 
  deleteRequirementInDB
}) {
  const updateValueAsTyping = (newValue, reqId, valueName) => {
    let newData = { ...orgData };
    newData.membershipRequirements[reqId][valueName] = newValue;
    setOrgData(newData);
    // console.log(newData);
  };

  const deleteRequirement = (id) => {
    // delete the requirement in the api
    deleteRequirementInDB(id)

    // remove the requirement from the orgData
    let newData = { ...orgData };
    newData.membershipRequirements = newData.membershipRequirements.filter(
      (requirement) => requirement.id !== id
    );
    setOrgData(newData);
    // console.log(newData);
  };

  return (
    <div className="org-email-settings">
      <h2>Membership Requirements</h2>

      {orgData.membershipRequirements.length < 1 ? (
        <p>No Requirements</p>
      ) : (
        <>
          {orgData.membershipRequirements.map((requirement, key) => {
            return (
              <MembershipRequirementLine
                requirement={requirement}
                color={color}
                updateValueAsTyping={updateValueAsTyping}
                updateValueWhenDone={updateValueInDB}
                deleteRequirement={deleteRequirement}
                key={key}
              />
            );
          })}
        </>
      )}
      <button
        className="custom-color-button"
        style={{ backgroundColor: color, borderColor: color }}
      >
        Add New Requirement
      </button>
    </div>
  );
}
