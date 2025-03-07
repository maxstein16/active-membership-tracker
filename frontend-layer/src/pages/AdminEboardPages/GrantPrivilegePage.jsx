import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import CustomSelect from "../../components/CustomSelect";
import { getOptionsForPrivilege } from "../../utils/grantPrivileges";

const defaultData = {
  orgNameSelected: "",
  memberNameSelected: "",
  role: "",
  possibleOrgs: [],
  possibleMembers: [],
  apiData: []
};

const defaultMessage = {
  isError: false,
  text: "",
};

export default function GrantPrivilegePage() {
  // const [apiData, setApiData] = React.useState([]);
  const [data, setData] = React.useState({ ...defaultData });
  const [message, setMessage] = React.useState({ ...defaultMessage });

  const clearData = () => {
    window.location.reload();
  };

  const updateData = (newValue, valueName) => {
    let newData = { ...data };
    newData[valueName] = newValue;

    // set the member options
    if (valueName === "orgNameSelected") {
        let orgSelected = data.apiData.filter((org) => org.name === newValue)[0]
        newData.possibleMembers = orgSelected.members.map((mem) => mem.name)
    }

    setData(newData);
  };

  const grantPrivilege = () => {
    // reset message
    setMessage({ ...defaultMessage });

    // grant privilege

    // error case
    setMessage({
      isError: true,
      text: "Privilege could not be granted. If you think this is wrong, please contact support.",
    });

    // success case
    setMessage({
      isError: false,
      text: "Privilege Granted.",
    });
  };

  React.useEffect(() => {
    // reset message
    setMessage({ ...defaultMessage });

    // get possible data
    getOptionsForPrivilege().then((result) => {
      if (result.hasOwnProperty("session")) {
        // no session
        setMessage({
          isError: true,
          text: "Must Login",
        });
      } else if (result.hasOwnProperty("error")) {
        // error case
        setMessage({
          isError: true,
          text: "Error fetching your data, please contact support.",
        });
      } else {
        let newData = { ...defaultData };
        newData.apiData = result;
        newData.possibleOrgs = result.map((org) => org.name)
        setData(newData);
        console.log(result)
      }
    });
  }, []);

  return (
    <PageSetup>
      <BackButton route={"/"} />

      <h1>Grant Privilege Page</h1>
      {message.text !== "" ? (
        <p className={message.isError ? "error" : "green"}>{message.text}</p>
      ) : (
        <></>
      )}
      <CustomSelect
        label="Organization"
        color={"orange"}
        options={data.possibleOrgs}
        startingValue={data.orgNameSelected}
        onSelect={(newValue) => {
          updateData(newValue, "orgNameSelected");
        }}
      />
      <CustomSelect
        label="Member"
        color={"orange"}
        options={data.possibleMembers}
        startingValue={data.memberNameSelected}
        onSelect={(newValue) => {
          updateData(newValue, "memberNameSelected");
        }}
      />
      <CustomSelect
        label="Role"
        color={"orange"}
        options={["Eboard", "Admin"]}
        startingValue={data.role}
        onSelect={(newValue) => {
          updateData(newValue, "role");
        }}
      />
      <div>
        <button className="secondary" onClick={clearData}>
          Clear
        </button>
        <button onClick={grantPrivilege}>Grant</button>
      </div>
    </PageSetup>
  );
}
