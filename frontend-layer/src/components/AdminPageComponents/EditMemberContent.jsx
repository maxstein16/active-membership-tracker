import * as React from "react";
import DialogContent from "@mui/material/DialogContent";

export default function EditMemberContent({ member, organization }) {
  return (
    <DialogContent
      style={{
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h3>Edit Member Details (Coming Soon)</h3>
      <p>Member Name: {member.name}</p>
      <p>Organization: {organization.name}</p>
      {/* Add edit form fields here when ready */}
    </DialogContent>
  );
}
