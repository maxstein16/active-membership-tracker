import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/adminPages.css";

import UserInput from "../../UserInput";
import CustomColorToggle from "../../CustomColorToggle";

export default function OrgSettingsBasicInfo({ orgData, saveSetting }) {
  // define my variables
  const [name, setName] = React.useState(orgData.name);
  const [abbreviation, setAbbreviation] = React.useState(orgData.abbreviation);
  const [description, setDescription] = React.useState(orgData.description);
  const [email, setEmail] = React.useState(orgData.email);
  const [color, setColor] = React.useState(orgData.color);
  const [threshold, setThreshold] = React.useState(orgData.threshold);
  const [isPoints, setIsPoints] = React.useState(orgData.isPointBased);


  const [error, setError] = React.useState("");

  return (
    <div className="org-settings-basic-info">
      {error !== "" ? <p className="error">{error}</p> : <></>}
      {/* Name */}
      <UserInput
        label="Organization Name"
        color={orgData.color}
        value={name}
        setValue={setName}
        isMultiline={false}
        onLeaveField={(newValue) => {
          if (newValue.trim() === "") {
            setError("Name must have a value");
            return;
          }
          setError("");
          saveSetting(newValue, "name");
        }}
      />

      {/* Abbreviation */}
      <UserInput
        label="Organization Abbreviation"
        color={orgData.color}
        value={abbreviation}
        setValue={setAbbreviation}
        isMultiline={false}
        onLeaveField={(newValue) => {
          if (newValue.trim() === "") {
            setError("Abbreviation must have a value");
            return;
          }
          setError("");
          saveSetting(newValue, "abbreviation");
        }}
      />

      {/* Email */}
      <UserInput
        label="Organization Email"
        color={orgData.color}
        value={email}
        setValue={setEmail}
        isMultiline={false}
        onLeaveField={(newValue) => {
          if (newValue.trim() === "") {
            setError("Email must have a value");
            return;
          } else if (newValue.indexOf("@") === -1) {
            setError("Must be a working email");
            return;
          }
          setError("");
          saveSetting(newValue, "email");
        }}
      />

      {/* Desc */}
      <UserInput
        label="Organization Description"
        color={orgData.color}
        value={description}
        setValue={setDescription}
        isMultiline={true}
        onLeaveField={(newValue) => {
          if (newValue.trim() === "") {
            setError("Description must have a value");
            return;
          }
          setError("");
          saveSetting(newValue, "description");
        }}
      />

      <div className="org-color-selector">
        <div
          className="org-color-preview"
          style={{ backgroundColor: color }}
        ></div>
        {/* Color */}
        <UserInput
          label="Organization Color (in Hex)"
          color={orgData.color}
          value={color}
          setValue={setColor}
          isMultiline={false}
          onLeaveField={(newValue) => {
            if (newValue.trim() === "") {
              setError("Color must have a value");
              return;
            }
            if (newValue.charAt(0) !== "#") {
              setError("Color must start with a '#'");
              return;
            }
            if (newValue.length !== 7) {
              setError(
                "Color must start with a '#' and have 6 digits following"
              );
              return;
            }
            setError("");
            saveSetting(newValue, "color");
          }}
        />
      </div>

      {/* Threshold */}
      <UserInput
        label="Active Membership Point Threshold"
        color={orgData.color}
        value={threshold}
        setValue={setThreshold}
        isMultiline={false}
        onLeaveField={(newValue) => {
          if (newValue.trim() === "") {
            setError("Threshold must have a value");
            return;
          }
          if (isNaN(newValue)) {
            setError("Threshold must be a number");
            return;
          }
          setError("");
          saveSetting(newValue, "threshold");
        }}
      />

      {/* Is Points or Percentage */}
      <CustomColorToggle
        label={"Is Points Based"}
        isChecked={isPoints}
        color={orgData.color}
        onChange={() => {
          setIsPoints(!isPoints);
          saveSetting(!isPoints, "isPointsBased");
        }}
      />
      <p><i>Turn this off for percentage based</i></p>
    </div>
  );
}
