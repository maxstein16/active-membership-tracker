import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/adminPages.css";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

import UserProfileData from "../../components/MemberPageComponents/UserProfileData";
import BottomCornerButton from "../../components/BottomCornerButton";
import { getMemberInfoData } from "../../utils/handleOrganizationMembers";
import displayErrors from "../../utils/displayErrors";

export default function MemberPopUpInfo({
  color,
  open,
  setOpen,
  orgId,
  memberId,
}) {
  const [member, setMember] = React.useState(undefined);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchMemberData() {
      try {
        const data = await getMemberInfoData(orgId, memberId);

        if (data.session === false) {
          setError(displayErrors.noSession);
          return;
        }

        if (data.error) {
          setError("Error fetching member data");
          return;
        }

        setMember(data); // Store member data
      } catch (err) {
        console.error("Error fetching member data:", err);
        setError("An unexpected error occurred.");
      }
    }

    if (open) {
      fetchMemberData();
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
            <div style={{ width: "45%" }}>
              <h3 style={{ textAlign: "center" }}>Status</h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Gauge
                  value={75}
                  startAngle={0}
                  endAngle={-360}
                  text="75%"
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
              <p>Meetings attended: 5</p>
              <p>Volunteer events: 1</p>
              <p>Social events: 1</p>
              <b>
                Points until Active:{" "}
                {Math.max(0, 100 - member.membership.points)}
              </b>
            </div>

            {/* Personal Data */}
            <div style={{ width: "45%" }}>
              <h3 style={{ textAlign: "center" }}>Personal Data</h3>
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
              />
            </div>
          </DialogContent>

          <DialogActions
            style={{ justifyContent: "center", paddingBottom: "1.5rem" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="custom-color-button"
              style={{ backgroundColor: color, borderColor: color }}
            >
              Close
            </button>
          </DialogActions>
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
