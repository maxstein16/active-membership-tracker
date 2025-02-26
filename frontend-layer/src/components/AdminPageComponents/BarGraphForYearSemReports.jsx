import * as React from "react";
import "../../assets/css/constants.css";
import "../../assets/css/pageSetup.css";
import "../../assets/css/general.css";
import "../../assets/css/memberPages.css";

import { BarChart } from "@mui/x-charts/BarChart";

export default function BarGraphForYearSemReports({ color, data, isYearly }) {
  let dataForMeetingsThis = Object.values(data.meetingsDataThis);
  dataForMeetingsThis.pop();
  let dataForMeetingsLast = Object.values(data.meetingsDataLast);
  dataForMeetingsLast.pop();

  const timeframeName = isYearly ? "year" : "semester"

  // Report Data
  //   {
  //       current: current, // must be a number
  //       memberDataThis: {
  //         totalMembers: 35,
  //         newMembers: 4,
  //         totalActive_members: 16,
  //         newActive_members: 6,
  //         members: [],
  //       },
  //       memberDataLast: {
  //         totalMembers: 35,
  //         newMembers: 4,
  //         totalActiveMembers: 16,
  //         newActiveMembers: 6,
  //       },
  //       meetingsDataThis: {
  //         numMeetings: 35,
  //         numEvents: 329,
  //         numVolunteering: 23,
  //         totalAttendance: 3294,
  //       },
  //       meetingsDataLast: {
  //         numMeetings: 24,
  //         numEvents: 234,
  //         numVolunteering: 12,
  //         totalAttendance: 2345,
  //       },
  //     }

  return (
    <div>
      <p>
        <b>Member</b> Data between this {timeframeName} and last {timeframeName}. Organization color is this {timeframeName}, grey is last {timeframeName}.
      </p>
      <BarChart
        series={[
          { data: Object.values(data.memberDataThis), color: color },
          { data: Object.values(data.memberDataLast), color: "#D0D3D4" },
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
          { data: dataForMeetingsLast, color: color },
          { data: dataForMeetingsLast, color: "#D0D3D4" },
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
          { data: [data.meetingsDataThis.totalAttendance], color: color },
          {
            data: [data.meetingsDataLast.totalAttendance],
            color: "#D0D3D4",
          },
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
