import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function MemberPopUpInfo({
  color,
  open,
  setOpen,
  orgId,
  memberId,
  membershipId,
}) {
  // store the data here
  // const [member, setMember] = React.useState(undefined);

  // GET THE DATA
  React.useEffect(() => {
    // get the data here with the member id
  }, []);

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
