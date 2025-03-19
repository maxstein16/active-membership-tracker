import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import UserProfileData from "../../components/MemberPageComponents/UserProfileData";
import BottomCornerButton from "../../components/BottomCornerButton";

export default function MemberDetailsContent({
  member,
  organization,
  color,
  setIsEditMode,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0.7rem" }}>
      <BottomCornerButton action={() => setIsEditMode(true)}>
        <EditIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
      </BottomCornerButton>

      {/* Status Section */}
      <div style={{ width: "45%", textAlign: "center" }}>
        <h3>Status</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Gauge
            value={member.activePercentage}
            startAngle={0}
            endAngle={-360}
            text={`${member.activePercentage}%`}
            width={200}
            height={200}
            innerRadius="65%"
            outerRadius="100%"
            sx={{
              [`& .${gaugeClasses.valueArc}`]: {
                fill: color,
              },
            }}
          />
        </div>
        <b>
          Points until Active:{" "}
          {Math.max(0, organization.threshold - member.membership.points)}
        </b>
      </div>

      {/* Personal Data */}
      <div style={{ width: "45%", textAlign: "center" }}>
        <h3>Personal Data</h3>
        <UserProfileData
          user={{
            name: member.name,
            email: member.email,
            personalEmail: member.personalEmail,
            phone: member.phoneNumber,
            major: member.major,
            gradMonth: member.graduationDate.split("/")[0] || "N/A",
            gradYear: member.graduationDate.split("/")[2] || "N/A",
            tshirt: member.tshirtSize,
            race: member.race,
            gender: member.gender,
          }}
          hideName={true}
          color={color}
        />
      </div>
    </div>
  );
}
