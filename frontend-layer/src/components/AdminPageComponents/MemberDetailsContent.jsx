import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import UserProfileData from "../../components/MemberPageComponents/UserProfileData";
import BottomCornerButton from "../../components/BottomCornerButton";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function MemberDetailsContent({
  member,
  organization,
  color,
  setIsEditMode,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "0.7rem",
      }}
    >
      <BottomCornerButton action={() => setIsEditMode(true)}>
        <EditIcon sx={{ color: "#FFFFFF", fontSize: 30 }} />
      </BottomCornerButton>

      {/* STATUS SECTION */}
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

        {organization.membershipType === "points" ? (
          <b>
            Points until Active:{" "}
            {Math.max(0, organization.threshold - member.membership.points)}
          </b>
        ) : (
          <div
            style={{
              textAlign: "left",
              marginTop: "1rem",
              marginLeft: "1rem",
            }}
          >
            {member.remainingAttendance.map((requirement, index) => (
              <Accordion key={index} style={{ marginBottom: "0.5rem" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`requirement-content-${index}`}
                  id={`requirement-header-${index}`}
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {requirement.event_type.replace("_", " ").toUpperCase()}
                    {requirement.fulfilled ? (
                      <CheckCircleIcon sx={{ color: "green", marginLeft: 1 }} />
                    ) : (
                      <CancelIcon sx={{ color: "red", marginLeft: 1 }} />
                    )}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Tooltip
                    title={
                      <div style={{ textAlign: "left" }}>
                        {requirement.requirement_type === "attendance_count" ? (
                          <>
                            <Typography variant="body2">
                              Attended: {requirement.attended} /{" "}
                              {requirement.required}
                            </Typography>
                            <Typography variant="body2">
                              Remaining: {requirement.remaining}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2">
                              Total Events: {requirement.totalEvents}
                            </Typography>
                            <Typography variant="body2">
                              Attendance %: {requirement.attendancePercentage}%
                            </Typography>
                            <Typography variant="body2">
                              Required %: {requirement.requiredPercentage}%
                            </Typography>
                            <Typography variant="body2">
                              Remaining %:{" "}
                              {requirement.remainingPercentage.toFixed(1)}%
                            </Typography>
                          </>
                        )}
                      </div>
                    }
                    arrow
                    placement="top"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Gauge
                        value={requirement.requirementPercentage}
                        startAngle={0}
                        endAngle={-360}
                        text={`${requirement.requirementPercentage}%`}
                        width={150}
                        height={150}
                        innerRadius="65%"
                        outerRadius="100%"
                        sx={{
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: color,
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#e0e0e0",
                          },
                        }}
                      />
                    </div>
                  </Tooltip>

                  <Typography
                    style={{
                      color: requirement.fulfilled ? "green" : "red",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                    }}
                  >
                    Status: {requirement.fulfilled ? "Fulfilled" : "Incomplete"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )}
      </div>

      {/* PERSONAL DATA SECTION */}
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
