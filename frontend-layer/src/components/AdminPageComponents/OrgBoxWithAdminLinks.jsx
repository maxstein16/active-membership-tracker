import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import OrgBox from "../MemberPageComponents/OrgBox";
import { ROLE_MEMBER } from "../../utils/constants.js";
import { Link } from "react-router";
import UploadDataModal from "./UploadDataModal.jsx";

export default function OrgBoxWithAdminLinks({ organization }) {
  const [openUploadDataModal, setOpenUploadDataModal] = React.useState(false);

  return (
    <>
      {organization.role !== ROLE_MEMBER ? (
        <div className="org-box-with-admin-links">
          <OrgBox org={organization} />
          <Link to={`/${organization.id}/settings`}>Settings</Link>
          <Link to={`/${organization.id}/reports`}>Reports</Link>

          {/* Upload Data Link + Popup */}
          <p onClick={() => setOpenUploadDataModal(true)}>Upload Data</p>
          <UploadDataModal
            orgId={organization.id}
            open={openUploadDataModal}
            setOpen={setOpenUploadDataModal}
          />
        </div>
      ) : (
        <OrgBox org={organization} />
      )}
    </>
  );
}
