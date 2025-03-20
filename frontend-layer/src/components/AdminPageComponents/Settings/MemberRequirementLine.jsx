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
  isPoints,
  color,
  updateValueAsTyping,
  updateValueWhenDone,
  deleteRequirement,
  deleteBonus,
  createBonus
}) {
  const [error, setError] = React.useState("");

  return (
    <div className="requirement-wrapper">
      {error !== "" ? <p className="error">{error}</p> : <></>}

      <div>
        <p>A member must participate in</p>
        {/* Amount */}
        <UserInput
          label={"amount"}
          color={color}
          value={requirement.value}
          setValue={(newValue) =>
            updateValueAsTyping(newValue, requirement.id, "value")
          }
          isMultiline={false}
          onLeaveField={(newValue) => {
            if (newValue.trim() === "") {
              setError("Amount must have a value");
              return;
            }
            if (isNaN(newValue)) {
              setError("Amount must be a number");
              return;
            }
            setError("");
            updateValueWhenDone(newValue, requirement.id, "value");
          }}
        />
        {isPoints ? <></> : <p className="percent">% of</p>}

        {/* Event Type Select */}
        <span className="i-need-space">
          <CustomSelect
            label="Meeting Type"
            color={color}
            options={[
              "general meeting",
              "volunteer",
              "social",
              "workshop",
              "fundraiser",
              "committee",
            ]}
            startingValue={requirement.eventType}
            onSelect={(value) =>
              updateValueWhenDone(value, requirement.id, "eventType")
            }
          />
        </span>

        {/* Delete Requirement Button */}
        <IconButton
          className="delete-requirement"
          onClick={() => deleteRequirement(requirement.id)}
        >
          <DeleteForeverIcon />
        </IconButton>
      </div>

      {/* Display Bonus */}
      {requirement.bonuses.map((bonus, index) => (
        <div key={index}>
          <p
            style={{
              color: color,
              textTransform: "uppercase",
            }}
          >
            <strong>Bonus</strong>
          </p>
          <p>If a member goes to </p>
          {/* Amount */}
          <UserInput
            label={"amount"}
            color={color}
            value={bonus.threshold}
            setValue={(newValue) =>
              updateValueAsTyping(newValue, bonus.id, "threshold", true)
            }
            isMultiline={false}
            onLeaveField={(newValue) => {
              if (newValue.trim() === "") {
                setError("Amount must have a value");
                return;
              }
              if (isNaN(newValue)) {
                setError("Amount must be a number");
                return;
              }
              setError("");
              updateValueWhenDone(newValue, bonus.id, "threshold", true);
            }}
          />
          <p>% of these meetings, then they gain</p>
          {/* Points */}
          <UserInput
            label={"points"}
            color={color}
            value={bonus.points}
            setValue={(newValue) =>
              updateValueAsTyping(newValue, bonus.id, "points", true)
            }
            isMultiline={false}
            onLeaveField={(newValue) => {
              if (newValue.trim() === "") {
                setError("Points must have a value");
                return;
              }
              if (isNaN(newValue)) {
                setError("Points must be a number");
                return;
              }
              setError("");
              updateValueWhenDone(newValue, bonus.id, "points", true);
            }}
          />
          <p>points</p>
          {/* Delete Requirement Button */}
          <IconButton
            className="delete-requirement"
            onClick={() => deleteBonus(requirement.id, bonus.id)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </div>
      ))}
      <button
        className="secondary custom-color-btn"
        style={{ color: color, borderColor: color }}
        onClick={() => {createBonus(requirement.id)}}
      >
        Add Bonus
      </button>
      <br/>
      <br/>
    </div>
  );
}
