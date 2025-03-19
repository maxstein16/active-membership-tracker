import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/adminPages.css";

import MembershipRequirementLine from "./MemberRequirementLine";

export default function DisplayMembershipRequirements({
  color,
  orgData,
  setOrgData,
  updateValueInDB,
  deleteRequirementInDB,
  createNewRequirement,
  createNewBonus,
}) {
  // TODO CHANGE FOR REQS
  const updateValueAsTyping = (newValue, reqId, valueName, isBonus = false) => {
    let newData = { ...orgData };
    newData.membershipRequirements.forEach((requirement) => {
      if (requirement.id === reqId) {
        requirement[valueName] = newValue;
      }
    });
    // console.log(newData)
    setOrgData(newData);
  };

  const deleteRequirement = (id) => {
    // delete the requirement in the api
    deleteRequirementInDB(id);

    // remove the requirement from the orgData
    let newData = { ...orgData };
    newData.membershipRequirements = newData.membershipRequirements.filter(
      (requirement) => requirement.id !== id
    );
    setOrgData(newData);
    // console.log(newData);
  };

  const deleteBonus = (id) => {
    console.log("TODO")
  }

  return (
    <div className="org-email-settings">
      <h2>Membership Requirements</h2>

      {orgData.membershipRequirements.length < 1 ? (
        <p>No Requirements</p>
      ) : (
        <>
          {orgData.membershipRequirements.map((requirement, key) => {
            return (
              <div key={key}>
                <MembershipRequirementLine
                  requirement={requirement}
                  isPoints={orgData.isPointBased}
                  color={color}
                  updateValueAsTyping={updateValueAsTyping}
                  updateValueWhenDone={updateValueInDB}
                  deleteRequirement={deleteRequirement}
                  deleteBonus={deleteBonus}
                  createBonus={createNewBonus}
                />
                <hr />
              </div>
            );
          })}
        </>
      )}

      <button
        className="custom-color-button"
        style={{ backgroundColor: color, borderColor: color }}
        onClick={createNewRequirement}
      >
        Add New Requirement
      </button>
    </div>
  );
}
