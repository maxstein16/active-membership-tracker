import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import EditIcon from "@mui/icons-material/Edit";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

import UserProfileData from "../../components/MemberPageComponents/UserProfileData";
import BottomCornerButton from "../../components/BottomCornerButton";
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
      {member && (
        <>
          <BottomCornerButton action={() => {}}>
            <EditIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
          </BottomCornerButton>
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

          <DialogContent
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "0.7rem",
            }}
          >
            {/* Status Section */}
            <div style={{ width: "45%", textAlign: "center" }}>
              <h3>Status</h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Gauge
                  value={member.activePercentage}
                  startAngle={0}
                  endAngle={-360}
                  text={`${member.activePercentage}`}
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
          </DialogContent>
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
