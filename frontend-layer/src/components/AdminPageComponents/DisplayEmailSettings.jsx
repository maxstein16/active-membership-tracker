import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

export default function DisplayEmailSettings({ emailSettings, orgData, setOrgData }) {
  // define my variables
  const [name, setName] = React.useState("");

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
    <div className="org-email-settings">
        <h2>Email Settings</h2>
      <p>h</p>
    </div>
  );
}
