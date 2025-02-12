import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import UserInput from "../UserInput";

export default function OrgSettingsBasicInfo({ orgData, setOrgData }) {
  // define my variables
  const [name, setName] = React.useState(orgData.name);
  const [abbreviation, setAbbreviation] = React.useState(orgData.abbreviation);
  const [description, setDescription] = React.useState(orgData.description);
  const [color, setColor] = React.useState(orgData.color);

  // create my functions
  const saveSetting = (newValue, valueName) => {
    // use the newValue variable to update the db (using getAPIdata method)

    // update the org data variable
    let newData = { ...orgData };
    newData[valueName] = newValue;
    setOrgData(newData);
    console.log(newData);
  };

  return (
    <div className="org-settings-basic-info">
      {/* Name */}
      <UserInput
        label="Organization Name"
        color={orgData.color}
        value={name}
        setValue={setName}
        isMultiline={false}
        onLeaveField={(newValue) => {saveSetting(newValue, 'name')}}
      />

      {/* Abbreviation */}
      <UserInput
        label="Organization Abbreviation"
        color={orgData.color}
        value={abbreviation}
        setValue={setAbbreviation}
        isMultiline={false}
        onLeaveField={(newValue) => {saveSetting(newValue, 'abbreviation')}}
      />

      {/* Desc */}
      <UserInput
        label="Organization Description"
        color={orgData.color}
        value={description}
        setValue={setDescription}
        isMultiline={true}
        onLeaveField={(newValue) => {saveSetting(newValue, 'description')}}
      />

      <div className="org-color-selector">
        <div className="org-color-preview" style={{backgroundColor: color}}></div>
        {/* Color */}
        <UserInput
          label="Organization Color (in Hex)"
          color={orgData.color}
          value={color}
          setValue={setColor}
          isMultiline={false}
          onLeaveField={(newValue) => {saveSetting(newValue, 'color')}}
          />
      </div>
    </div>
  );
}
