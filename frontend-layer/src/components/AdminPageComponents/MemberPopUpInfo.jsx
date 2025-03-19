import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";

import EditIcon from "@mui/icons-material/Edit";
import BottomCornerButton from "../../components/BottomCornerButton";

import MemberDetailsContent from "./MemberDetailsContent";
import EditMemberContent from "./EditMemberContent";

import {
  getMemberInfoData,
  getOrgInfoData,
} from "../../utils/handleOrganizationMembers";
import displayErrors from "../../utils/displayErrors";

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
  const [isEditMode, setIsEditMode] = React.useState(false);

  // Fetch data function
  const fetchData = React.useCallback(async () => {
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
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An unexpected error occurred.");
    }
  }, [orgId, memberId]);

  // Fetch when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [fetchData, open]);

  // Reset states when dialog closes
  const handleClose = () => {
    setOpen(false);
    setMember(undefined);
    setOrganization(undefined);
    setIsEditMode(false);
    setError("");
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
      {error && (
        <DialogContent>
          <p>{error}</p>
        </DialogContent>
      )}

      {!member || !organization ? (
        <DialogContent style={{ textAlign: "center", padding: "2rem" }}>
          <CircularProgress />
        </DialogContent>
      ) : (
        <>
          <DialogTitle
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {isEditMode
              ? "Edit Membership"
              : member.membership.isActive
              ? "Active Member"
              : "General Member"}
            <br />
            <span style={{ color: "#00bcd4", fontSize: "3rem" }}>
              {member.name}
            </span>
          </DialogTitle>

          {isEditMode ? (
            <EditMemberContent
              member={member}
              organization={organization}
              setIsEditMode={setIsEditMode}
              refreshMemberData={fetchData}
              color={color}
              setOpen={setOpen}
            />
          ) : (
            <>
              <BottomCornerButton action={() => setIsEditMode(true)}>
                <EditIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
              </BottomCornerButton>
              <MemberDetailsContent
                member={member}
                organization={organization}
                setIsEditMode={setIsEditMode}
                color={color}
              />
            </>
          )}
        </>
      )}
    </Dialog>
  );
}
