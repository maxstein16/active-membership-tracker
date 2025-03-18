import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

import CustomSelect from "../../CustomSelect";
import DownloadReport from "./DownloadReport";
import { CircularProgress } from "@mui/material";
import BarGraphForYearSemReports from "./BarGraphForYearSemReports";

export default function YearlyReport({ orgId, color }) {
  // define variables
  const [reportData, setReportData] = React.useState(undefined);
  const [yearList, setYearList] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(undefined);

  // get initial data
  React.useEffect(() => {
    // get the report info from the database with the orgId

    // set the reportData state variable
    // the data MUST BE FORMATTED AND LABELLED LIKE THIS
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);

    setReportData({
      currentYear: currentYear, // must be a number
      memberDataThis: {
        totalMembers: 35,
        newMembers: 4,
        totalActive_members: 16,
        newActive_members: 6,
        members: [],
      },
      memberDataLast: {
        totalMembers: 24,
        newMembers: 9,
        totalActiveMembers: 12,
        newActiveMembers: 4,
      },
      meetingsDataThis: {
        numMeetings: 35,
        numEvents: 329,
        numVolunteering: 23,
        totalAttendance: 3292,
      },
      meetingsDataLast: {
        numMeetings: 24,
        numEvents: 234,
        numVolunteering: 12,
        totalAttendance: 2345,
      },
    });

    // must be a number -> get from db
    const earliestEventYear = 2018;

    // set the array of possible years to get reports from
    let possibleYears = [];
    for (let i = currentYear; i >= earliestEventYear; i--) {
      // console.log(i);
      possibleYears.push(i);
    }
    setYearList(possibleYears);
  }, []);

  return (
    <>
      {!reportData ? (
        <CircularProgress/>
      ) : (
        <div className="yearly-report">
          <h2>Yearly Report</h2>

          <div className="report-pick-and-download">
            <CustomSelect
              label="Meeting Type"
              color={color}
              options={yearList}
              startingValue={selectedYear}
              onSelect={
                (value) => setSelectedYear(value)
                // get new report data
              }
            />
            <DownloadReport color={color} classToDownload={"yearly-report"} />
          </div>

          <div className="yearly-report-content">
              <h3 style={{color: color}}>{selectedYear}</h3>
              <BarGraphForYearSemReports color={color} data={reportData} isYearly={true}/>
          </div>
        </div>
      )}
    </>
  );
}
