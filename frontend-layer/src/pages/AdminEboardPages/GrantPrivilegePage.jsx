import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import CustomSelect from "../../components/CustomSelect";
import { ROLE_MEMBER } from "../../utils/constants";

const defaultData = {
  orgIdSelected: -1,
  orgNameSelected: "",
  memberIdSelected: -1,
  memberNameSelected: "",
  role: ROLE_MEMBER,
  possibleOrgs: [],
  possibleMembers: [],
};

export default function GrantPrivilegePage() {
  const [data, setData] = React.useState({...defaultData});
  const [message, setMessage] = React.useState({
    isError: false,
    text: "",
  });

  const clearData = () => {
    console.log("clear")
    setData({...defaultData})
  };

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
        options={["wic"]}
        startingValue={""}
        onSelect={() => {}}
      />
      <CustomSelect
        label="Member"
        color={"orange"}
        options={["wic"]}
        startingValue={""}
        onSelect={() => {}}
      />
      <CustomSelect
        label="Role"
        color={"orange"}
        options={["Eboard", "Admin"]}
        startingValue={"Eboard"}
        onSelect={() => {}}
      />
      <div>
        <button className="secondary" onClick={clearData}>Clear</button>
        <button>Grant</button>
      </div>
    </PageSetup>
  );
}
