import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import UserInput from "../../components/UserInput";
import CustomSelect from "../../components/CustomSelect";
import { updateMembershipData } from "../../utils/handleOrganizationMembers";
import { ROLE_ADMIN, ROLE_EBOARD, ROLE_MEMBER } from "../../utils/constants";

export default function EditMemberContent({
  member,
  organization,
  setIsEditMode,
  refreshMemberData,
  refreshMembers,
  triggerSnackbar,
  setOpen,
  color,
}) {
  const roleOptions = [
    { label: "Member", value: ROLE_MEMBER },
    { label: "E-Board", value: ROLE_EBOARD },
    { label: "Admin", value: ROLE_ADMIN },
  ];

  const [membershipData, setMembershipData] = React.useState({
    membership_points: member.membership.points,
    membership_role: member.membership.role,
  });

  const [error, setError] = React.useState("");

  // Generic handler
  const handleFieldChange = (field, value) => {
    setMembershipData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const submissionData = {};

    // Points-based orgs
    if (organization.membershipType === "points") {
      const pointsNum = parseInt(membershipData.membership_points, 10);
      if (isNaN(pointsNum) || pointsNum < 0) {
        setError("Points must be a valid non-negative number");
        return;
      }
      submissionData.membership_points = pointsNum;
    }

    submissionData.role = membershipData.membership_role;

    const success = await updateMembershipData(
      organization.id,
      member.id,
      submissionData
    );

    if (success) {
      await refreshMemberData();
      await refreshMembers();
      setIsEditMode(false);
      setOpen(false);
      triggerSnackbar();
    } else {
      setError("Failed to update membership. Please try again.");
    }
  };

  return (
    <DialogContent
      style={{
        padding: "2rem",
      }}
    >
      {/* Membership Role */}
      <div style={{ margin: "1rem 0" }}>
        <CustomSelect
          label="Membership Role"
          color={color}
          options={roleOptions.map((role) => role.label)}
          startingValue={
            roleOptions.find((r) => r.value === membershipData.membership_role)
              ?.label || "Member"
          }
          onSelect={(selectedRole) => {
            const roleObj = roleOptions.find(
              (role) => role.label === selectedRole
            );
            handleFieldChange("membership_role", roleObj.value);
          }}
        />
      </div>

      {/* Points-based field */}
      {organization.membershipType === "points" && (
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
      )}

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
