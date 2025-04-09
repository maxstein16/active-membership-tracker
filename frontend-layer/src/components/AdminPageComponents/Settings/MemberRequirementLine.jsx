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
  createBonus,
}) {
  const [error, setError] = React.useState("");
  const [showPercent, setShowPercent] = React.useState(!isPoints && requirement.type === "percentage")

  return (
    <div className="requirement-wrapper">
      {error !== "" ? <p className="error">{error}</p> : <></>}

      <div>
        <p>A member must participate in</p>

        {/* Value input */}
        <UserInput
          label={isPoints ? "points" : "amount"}
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

        {/* % label if percentage-based attendance */}
        {showPercent ? (
          <p className="percent">% of</p>
        ) : null}

        {/* Event Type */}
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

        {/* For attendance-based: show dropdown to choose type */}
        {!isPoints && (
          <span className="i-need-space">
            <CustomSelect
              label="Requirement Type"
              color={color}
              options={[
                { label: "attendance count", value: "attendance_count" },
                { label: "percentage", value: "percentage" }
              ]}
              startingValue={requirement.type}
              onSelect={(value) => {
                updateValueWhenDone(value, requirement.id, "type")
                setShowPercent(value === "percentage")
              }
              }
            />
          </span>
        )}

        {/* Delete Requirement */}
        <IconButton
          className="delete-requirement"
          onClick={() => deleteRequirement(requirement.id)}
        >
          <DeleteForeverIcon />
        </IconButton>
      </div>

      {/* BONUS SECTION: Only for points-based orgs */}
      {isPoints &&
        requirement.bonuses.map((bonus, index) => (
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

            {/* Threshold */}
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

            {/* Delete Bonus */}
            <IconButton
              className="delete-requirement"
              onClick={() => deleteBonus(requirement.id, bonus.id)}
            >
              <DeleteForeverIcon />
            </IconButton>
          </div>
        ))}

      {/* Add Bonus Button only if points-based */}
      {isPoints && (
        <button
          className="secondary custom-color-btn"
          style={{ color: color, borderColor: color }}
          onClick={() => {
            createBonus(requirement.id);
          }}
        >
          Add Bonus
        </button>
      )}
      <br />
      <br />
    </div>
  );
}
