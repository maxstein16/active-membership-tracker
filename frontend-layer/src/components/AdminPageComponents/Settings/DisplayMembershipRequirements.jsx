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
  deleteBonusRequirementInDb,
  createNewRequirement,
  createNewBonus,
}) {
  const updateValueAsTyping = (newValue, id, valueName, isBonus = false) => {
    let newData = { ...orgData };

    if (isBonus) {
      newData.membershipRequirements.forEach((requirement) => {
        requirement.bonuses.forEach((bonus) => {
          if (bonus.id === id) {
            bonus[valueName] = newValue;
          }
        });
      });
    } else {
      newData.membershipRequirements.forEach((requirement) => {
        if (requirement.id === id) {
          requirement[valueName] = newValue;
        }
      });
    }

    setOrgData(newData);
  };

  const deleteRequirement = (id) => {
    deleteRequirementInDB(id);

    let newData = { ...orgData };
    newData.membershipRequirements = newData.membershipRequirements.filter(
      (requirement) => requirement.id !== id
    );
    setOrgData(newData);
  };

  const deleteBonus = (reqId, bonusId) => {
    deleteBonusRequirementInDb(bonusId);

    let newData = { ...orgData };
    newData.membershipRequirements.forEach((requirement, index) => {
      if (requirement.id === reqId) {
        newData.membershipRequirements[index].bonuses =
          requirement.bonuses.filter((bonus) => bonus.id !== bonusId);
      }
    });

    setOrgData(newData);
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
              <div key={key}>
                <MembershipRequirementLine
                  requirement={requirement}
                  isPoints={orgData.isPointBased}
                  color={color}
                  updateValueAsTyping={updateValueAsTyping}
                  updateValueWhenDone={updateValueInDB}
                  deleteRequirement={deleteRequirement}
                  deleteBonus={deleteBonus}
                  createBonus={
                    orgData.isPointBased
                      ? createNewBonus // Only pass if points-based
                      : null
                  }
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
