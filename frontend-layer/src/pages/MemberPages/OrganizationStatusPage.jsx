import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { Link, useParams } from "react-router-dom";
import PageSetup from "../../components/PageSetup/PageSetup";
import BackButton from "../../components/BackButton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import useWindowWidth from "../../utils/useWindowWidth";
import {
  getMemberData,
  getOrganizationData,
} from "../../utils/handleSettingsData";
import displayErrors from "../../utils/displayErrors";
import { CircularProgress } from "@mui/material";

export default function OrganizationStatusPage() {
  const { orgId } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [memberInfo, setMemberInfo] = React.useState(undefined);
  const [orgData, setOrgData] = React.useState(undefined);

  const windowWidth = useWindowWidth();

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const memberId = 1; // Replace with actual member ID logic
        const result = await getMemberData(orgId, memberId);
        const orgResult = await getOrganizationData(orgId);

        const safeResult = {
          ...result,
          active_percentage: result.active_percentage || 0,
          activeSemesters: result.activeSemesters || 0,
          membership: {
            ...(result.membership || {}),
            membership_points: result.membership?.membership_points || 0,
          },
          remaining_attendance: result.remaining_attendance || [],
        };

        /*

    active_percentage: 0,
    activeSemesters: 1,
    membership: {
      membership_points: 0,
    },
    remaining_attendance: [],
  
        */
        setMemberInfo(safeResult);
        setOrgData({
          ...orgResult,
          organization_threshold: orgResult.organization_threshold || 0,
        });
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
      <PageSetup>
        <BackButton route="/" />
        <CircularProgress />
      </PageSetup>
    );
  }

  return (
    <PageSetup>
      <BackButton route="/" />

      {!memberInfo || !orgData ? (
        <p>{displayErrors.errorFetchingContactSupport}</p>
      ) : (
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
              <span style={{ color: orgData.organization_color }}>{orgData.organization_abbreviation}</span>
            </h1>
            <p style={{ marginBottom: "20px" }}>
              {orgData.organization_description}
            </p>
            <Link
              className="sub-link"
              to={`/${orgData.organization_id}/events`}
              style={{ color: orgData.organization_color }}
            >
              View {orgData.organization_abbreviation}'s Events
            </Link>
            <p>
              You have been an active member for{" "}
              <strong>
                {memberInfo.activeSemesters} semester
                {memberInfo.activeSemesters === 1 ? "" : "s"}
              </strong>
              .
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
                    data={[
                      { name: "Completed", value: memberInfo.active_percentage },
                      { name: "Remaining", value: 100 - memberInfo.active_percentage },
                    ]}
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
                    <Cell key="cell-0" fill={orgData.organization_color} />
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
                {orgData.organization_membership_type === "points" ? (
                  <>
                    <p>
                      You have <strong>{memberInfo.membership?.membership_points || 0}</strong> total points.
                    </p>
                    {memberInfo.membership?.membership_points || 0 >= orgData.organization_threshold ? (
                      <p>
                        That is <strong>{Math.max(0, memberInfo.membership?.membership_points - orgData.organization_threshold)}</strong> points above the
                        minimum requirement!
                      </p>
                    ) : (
                      <p>
                        Earn <strong>{Math.max(0, orgData.organization_threshold - memberInfo.membership?.membership_points)}</strong> more points to
                        become an active member this semester!
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
                        <h4>
                          {req.event_type?.replace("_", " ").toUpperCase() ||
                            "Unknown Event Type"}
                        </h4>
                        {req.requirement_type === "attendance_count" ? (
                          <>
                            <p>
                              Attended: <strong>{req.attended || 0}</strong> /{" "}
                              {req.required || 0}
                            </p>
                            <p>
                              Remaining: <strong>{req.remaining || 0}</strong>
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Total Events:{" "}
                              <strong>{req.totalEvents || 0}</strong>
                            </p>
                            <p>
                              Attendance %:{" "}
                              <strong>{req.attendancePercentage || 0}%</strong>
                            </p>
                            <p>
                              Required %:{" "}
                              <strong>{req.requiredPercentage || 0}%</strong>
                            </p>
                            <p>
                              Remaining %:{" "}
                              <strong>
                                {(req.remainingPercentage || 0).toFixed(1)}%
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
      )}
    </PageSetup>
  );
}
