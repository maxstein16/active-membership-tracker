import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import {
  getMemberInfoData,
  getOrgInfoData,
} from "../../utils/handleOrganizationMembers";
import displayErrors from "../../utils/displayErrors";

import MemberDetailsContent from "./MemberDetailsContent";
import EditMemberContent from "./EditMemberContent";

export default function MemberPopUpInfo({
  color,
  open,
  setOpen,
  orgId,
  memberId,
}) {
  const [member, setMember] = React.useState(undefined);
  const [organization, setOrganization] = React.useState(undefined);
  const [error, setError] = React.useState("");
  const [showEdit, setShowEdit] = React.useState(false); // control content

  React.useEffect(() => {
    async function fetchData() {
      try {
        const memberData = await getMemberInfoData(orgId, memberId);
        const orgData = await getOrgInfoData(orgId);

        if (memberData.session === false || orgData.session === false) {
          setError(displayErrors.noSession);
          return;
        }

        if (memberData.error || orgData.error) {
          setError("Error fetching data");
          return;
        }

        setMember(memberData);
        setOrganization(orgData);
        setShowEdit(false); // reset to default view on open
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An unexpected error occurred.");
      }
    }

    if (open) {
      fetchData();
    }
  }, [orgId, memberId, open]);

  return (
    <Dialog onClose={() => setOpen(false)} open={open} maxWidth="md" fullWidth>
      {member && organization && (
        <>
          <DialogTitle
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {member.membership.isActive ? "Active Member" : "General Member"}
            <br />
            <span style={{ color: "#00bcd4", fontSize: "3rem" }}>
              {member.name}
            </span>
          </DialogTitle>

          {showEdit ? (
            <EditMemberContent
              member={member}
              organization={organization}
              color={color}
              setShowEdit={setShowEdit} // allow returning to default view
            />
          ) : (
            <MemberDetailsContent
              member={member}
              organization={organization}
              color={color}
              setShowEdit={setShowEdit} // pass down to show button
            />
          )}
        </>
      )}

      {error && (
        <DialogContent>
          <p>{error}</p>
        </DialogContent>
      )}
    </Dialog>
  );
}
