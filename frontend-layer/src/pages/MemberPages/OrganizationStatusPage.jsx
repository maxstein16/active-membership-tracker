import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import useWindowWidth from "../../utils/useWindowWidth";
import {
  getMemberData,
  getOrganizationData,
} from "../../utils/handleSettingsData";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [memberInfo, setMemberInfo] = React.useState({
    active_percentage: 0,
    activeSemesters: 1,
    membership: {},
    remaining_attendance: [], // For attendance-based orgs
  });
  const [orgData, setOrgData] = React.useState({
    organization_abbreviation: "",
    organization_color: "#5bc0de",
    organization_description: "",
    organization_membership_type: "points", // or 'attendance'
    organization_threshold: 0,
  });

  const windowWidth = useWindowWidth();

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const memberId = 1; // Replace with actual member ID logic
        const result = await getMemberData(orgId, memberId);
        const orgResult = await getOrganizationData(orgId);

        console.log("Member result:", result);
        console.log("Org result:", orgResult);

        setMemberInfo(result);
        setOrgData(orgResult);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [orgId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const pieData = [
    { name: "Completed", value: memberInfo.active_percentage },
    { name: "Remaining", value: 100 - memberInfo.active_percentage },
  ];

  const isPointsBased = orgData.organization_membership_type === "points";
  const color = orgData.organization_color || "#5bc0de";
  const activeSemestersText = `${memberInfo.activeSemesters} semester${
    memberInfo.activeSemesters === 1 ? "" : "s"
  }`;

  return (
    <PageSetup>
      <BackButton route="/" />

      <div
        className={
          windowWidth > 499
            ? "member-progress-chart-page"
            : "member-progress-chart-page-mobile"
        }
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <h1>
            Your Membership with{" "}
            <span style={{ color }}>{orgData.organization_abbreviation}</span>
          </h1>
          <p style={{ marginBottom: "20px" }}>
            {orgData.organization_description}
          </p>
          <p>
            You have been an active member for{" "}
            <strong>{activeSemestersText}</strong>.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  startAngle={90}
                  endAngle={450}
                  strokeWidth={0}
                >
                  <Cell key="cell-0" fill={color} />
                  <Cell key="cell-1" fill="#d6d2dd" />
                </Pie>

                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan x="50%" fontSize="24" fontWeight="bold">
                    {memberInfo.active_percentage}%
                  </tspan>
                  <tspan x="50%" dy="1.2em">
                    to Active
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {isPointsBased ? (
                <>
                  <p>
                    You have{" "}
                    <strong>{memberInfo.membership.membership_points}</strong>{" "}
                    total points.
                  </p>
                  {memberInfo.membership.membership_points >=
                  orgData.organization_threshold ? (
                    <p>
                      That is{" "}
                      <strong>
                        {memberInfo.membership.membership_points -
                          orgData.organization_threshold}
                      </strong>{" "}
                      points above the minimum requirement!
                    </p>
                  ) : (
                    <p>
                      Earn{" "}
                      <strong>
                        {orgData.organization_threshold -
                          memberInfo.membership.membership_points}
                      </strong>{" "}
                      more points to become an active member this semester!
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3>Attendance Requirements:</h3>
                  {memberInfo.remaining_attendance.map((req, idx) => (
                    <div
                      key={idx}
                      style={{ marginBottom: "1rem", textAlign: "left" }}
                    >
                      <h4>{req.event_type.replace("_", " ").toUpperCase()}</h4>
                      {req.requirement_type === "attendance_count" ? (
                        <>
                          <p>
                            Attended: <strong>{req.attended}</strong> /{" "}
                            {req.required}
                          </p>
                          <p>
                            Remaining: <strong>{req.remaining}</strong>
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            Total Events: <strong>{req.totalEvents}</strong>
                          </p>
                          <p>
                            Attendance %:{" "}
                            <strong>{req.attendancePercentage}%</strong>
                          </p>
                          <p>
                            Required %:{" "}
                            <strong>{req.requiredPercentage}%</strong>
                          </p>
                          <p>
                            Remaining %:{" "}
                            <strong>
                              {req.remainingPercentage.toFixed(1)}%
                            </strong>
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageSetup>
  );
}
