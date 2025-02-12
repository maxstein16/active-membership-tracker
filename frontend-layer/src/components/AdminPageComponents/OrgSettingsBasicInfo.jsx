import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import UserInput from "../UserInput";

export default function OrgSettingsBasicInfo({ orgData, setOrgData }) {

    // define my variables
    const [name, setName] = React.useState(orgData.name);

    // create my functions
    const saveName = () => {
        // use the name variable to update the db (using getAPIdata method)
        // also update the orgData
    }

  return (
    <div className="org-settings-basic-info">
      <UserInput
        label="Organization Name"
        color={orgData.color}
        value={name}
        setValue={setName}
        isMultiline={true}
        onLeaveField={saveName}
      />
    </div>
  );
}
