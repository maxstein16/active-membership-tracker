import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import OrgBox from "../MemberPageComponents/OrgBox";
import { ROLE_MEMBER } from "../../utils/constants.js";
import { Link } from "react-router";

export default function OrgBoxWithAdminLinks({ organization }) {
  return (
    <>
      {organization.role !== ROLE_MEMBER ? (
        <div className="org-box-with-admin-links">
          <OrgBox org={organization} />
          <Link to={`/${organization.id}/settings`}>Settings</Link>
          <Link to={`/${organization.id}/reports`}>Reports</Link>
          <Link to={`/${organization.id}/events`}>Events</Link>
        </div>
      ) : (
        <OrgBox org={organization} />
      )}
    </>
  );
}
