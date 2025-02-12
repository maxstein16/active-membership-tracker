import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { useNavigate } from "react-router-dom";

export default function OrgBox({ org }) {
  // Define my variables
  const navigate = useNavigate();

  return (
    <div className="org-box-wrapper" onClick={() => navigate(`/${org.id}/status`)}>
      <div
        className="org-box-color"
        style={{ backgroundColor: org.color }}
      ></div>
      <div className="org-box-name">
        <h2>{org.abbreviation}</h2>
      </div>
    </div>
  );
}
