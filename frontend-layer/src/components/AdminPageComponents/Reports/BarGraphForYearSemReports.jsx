import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

import { BarChart } from "@mui/x-charts/BarChart";

const ensureNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value) ? value : 0;
};

export default function BarGraphForYearSemReports({ color, data, isYearly }) {
  if (!data || !data.memberDataThis || !data.memberDataLast || 
      !data.meetingsDataThis || !data.meetingsDataLast) {
    console.error("Invalid data structure for bar chart:", data);
    return <div className="error-message">Unable to display chart: invalid data format</div>;
  }

  const thisMemberData = [
    ensureNumber(data.memberDataThis.totalMembers),
    ensureNumber(data.memberDataThis.newMembers),
    ensureNumber(data.memberDataThis.totalActive_members),
    ensureNumber(data.memberDataThis.newActive_members)
  ];
  
  const lastMemberData = [
    ensureNumber(data.memberDataLast.totalMembers),
    ensureNumber(data.memberDataLast.newMembers),
    ensureNumber(data.memberDataLast.totalActiveMembers || data.memberDataLast.totalActive_members),
    ensureNumber(data.memberDataLast.newActiveMembers || data.memberDataLast.newActive_members)
  ];

  const thisMeetingsData = [
    ensureNumber(data.meetingsDataThis.numMeetings),
    ensureNumber(data.meetingsDataThis.numEvents),
    ensureNumber(data.meetingsDataThis.numVolunteering)
  ];
  
  const lastMeetingsData = [
    ensureNumber(data.meetingsDataLast.numMeetings),
    ensureNumber(data.meetingsDataLast.numEvents),
    ensureNumber(data.meetingsDataLast.numVolunteering)
  ];

  const thisAttendance = ensureNumber(data.meetingsDataThis.totalAttendance);
  const lastAttendance = ensureNumber(data.meetingsDataLast.totalAttendance);

  const timeframeName = isYearly ? "year" : "semester";

  return (
    <div>
      <p>
        <b>Member</b> Data between this {timeframeName} and last {timeframeName}. Organization color is this {timeframeName}, grey is last {timeframeName}.
      </p>
      <BarChart
        series={[
          { data: thisMemberData, color: color },
          { data: lastMemberData, color: "#D0D3D4" },
        ]}
        height={300}
        xAxis={[
          {
            data: [
              "Total Members",
              "New Members",
              "Total Active Members",
              "New Active Members",
            ],
            scaleType: "band",
          },
        ]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        borderRadius={10}
      />

      <p>
        <b>Events</b> between this {timeframeName} and last {timeframeName}. Organization color is this {timeframeName}, grey is last {timeframeName}.
      </p>
      <BarChart
        series={[
          { data: thisMeetingsData, color: color },
          { data: lastMeetingsData, color: "#D0D3D4" },
        ]}
        height={300}
        xAxis={[
          {
            data: [
              "Number of Meetings",
              "Number of Events",
              "Number Volunteering",
            ],
            scaleType: "band",
          },
        ]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        borderRadius={10}
      />

      <p>
        <b>Total Attendance</b> between this {timeframeName} and last {timeframeName}. Organization color is this {timeframeName}, grey is last {timeframeName}.
      </p>
      <BarChart
        series={[
          { data: [thisAttendance], color: color },
          { data: [lastAttendance], color: "#D0D3D4" },
        ]}
        height={300}
        xAxis={[
          {
            data: [
              "Total Attendance",
            ],
            scaleType: "band",
          },
        ]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        borderRadius={10}
      />
    </div>
  );
}