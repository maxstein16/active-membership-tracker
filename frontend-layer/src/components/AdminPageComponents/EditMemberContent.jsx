import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import UserInput from "../../components/UserInput";
import { updateMembershipData } from "../../utils/handleOrganizationMembers";

export default function EditMemberContent({
  member,
  organization,
  setIsEditMode,
  refreshMemberData,
  refreshMembers,
  setOpen,
  color,
}) {
  // State for membership data (easily extendable)
  const [membershipData, setMembershipData] = React.useState({
    membership_points: member.membership.points,
    // Add more fields here in future (e.g., role, active_member, received_bonus)
  });

  const [error, setError] = React.useState("");

  // Generic handler for input changes
  const handleFieldChange = (field, value) => {
    setMembershipData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Basic validation for points
    const pointsNum = parseInt(membershipData.membership_points, 10);
    if (isNaN(pointsNum) || pointsNum < 0) {
      setError("Points must be a valid non-negative number");
      return;
    }

    const submissionData = {
      membership_points: pointsNum,
      // Add more fields as needed
    };

    const success = await updateMembershipData(
      organization.id,
      member.id,
      submissionData
    );

    console.log("Frontend API PUT response: ", success);

    if (success) {
      await refreshMemberData(); // Refresh data after successful update
      await refreshMembers();
      setIsEditMode(false); // Return to details view
      setOpen(false); // Optionally close dialog
    } else {
      setError("Failed to update membership. Please try again.");
    }
  };

  return (
    <DialogContent
      style={{
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Membership Points */}
      <div style={{ margin: "1rem 0" }}>
        <UserInput
          label="Membership Points"
          color={color}
          value={membershipData.membership_points}
          setValue={(value) => handleFieldChange("membership_points", value)}
          isMultiline={false}
          onLeaveField={() => {}}
        />
      </div>

      {/* Add more editable fields here easily later */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1.5rem" }}>
        <button className="secondary" onClick={() => setIsEditMode(false)}>
          Cancel
        </button>
        <button onClick={handleSave}>Save</button>
      </div>
    </DialogContent>
  );
}
