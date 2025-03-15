import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { getMemberInfoData } from "../../utils/handleOrganizationMembers";
import displayErrors from "../../utils/displayErrors";

export default function MemberPopUpInfo({
  color,
  open,
  setOpen,
  orgId,
  memberId,
  membershipId,
}) {
  // store the data here
  const [member, setMember] = React.useState(undefined);
  const [error, setError] = React.useState("");

  // GET THE DATA
  React.useEffect(() => {
    async function fetchMemberData() {
      try {
        const data = await getMemberInfoData(orgId, memberId);

        if (data.session === false) {
          setError(displayErrors.noSession);
          return;
        }

        if (data.error) {
          setError(data.error);
          return;
        }

        setMember(data); // Store member data in state
      } catch (err) {
        console.error("Error fetching member data:", err);
        setError("An unexpected error occurred.");
      }
    }

    fetchMemberData();
  }, [orgId, memberId]);

  return (
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <DialogTitle>TODO Member Name</DialogTitle>
      <DialogContent>
        <p>
          org id: {orgId} <br />
          member id: {memberId} <br />
          membership id: {membershipId}
        </p>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className="custom-color-button"
          style={{ backgroundColor: color, borderColor: color }}
        >
          Ok
        </button>
      </DialogActions>
    </Dialog>
  );
}
