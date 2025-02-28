import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/adminPages.css";

import UserInput from "../../UserInput";
import CustomSelect from "../../CustomSelect";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IconButton } from "@mui/material";

export default function MembershipRequirementLine({
  requirement,
  color,
  updateValueAsTyping,
  updateValueWhenDone,
  deleteRequirement,
}) {

  const [error, setError] = React.useState("");

  return (
    <div className="requirement-wrapper">
      { error !== "" ? <p className="error">{error}</p> : <></>}
      <div className="percent-or-amount">
        <p>A member must participate in</p>
        {/* Amount */}
        <UserInput
          label={requirement.amountType}
          color={color}
          value={requirement.amount}
          setValue={(newValue) => updateValueAsTyping(newValue, requirement.id, "amount")}
          isMultiline={false}
          onLeaveField={(newValue) => {
            if (newValue.trim() === "") {
              setError("Amount must have a value")
              return;
            }
            if (isNaN(newValue)) {
              setError("Amount must be a number")
              return
            }
            setError("")
            updateValueWhenDone(newValue, requirement.id, "amount");
          }}
        />
        {requirement.amountType === "percent" ? (
          <p className="percent">% of</p>
        ) : (
          <></>
        )}
      </div>

      <div className="selects-and-delete">
        {/* Meeting Type Select */}
        <CustomSelect
          label="Meeting Type"
          color={color}
          options={["general meeting", "volunteer", "social", "workshop", "fundraiser", "committee"]}
          startingValue={requirement.meetingType}
          onSelect={(value) => updateValueWhenDone(value, requirement.id, "meetingType")}
        />

        {/* Frequency Type Select */}
        <CustomSelect
          label="Frequency"
          color={color}
          options={["semesterly", "annually"]}
          startingValue={requirement.frequency}
          onSelect={(value) => updateValueWhenDone(value, requirement.id, "frequency")}
        />

        {/* Delete Requirement Button */}
        <IconButton
          className="delete-requirement"
          onClick={() => deleteRequirement(requirement.id)}
        >
          <DeleteForeverIcon />
        </IconButton>

      </div>

      <hr/>
    </div>
  );
}
