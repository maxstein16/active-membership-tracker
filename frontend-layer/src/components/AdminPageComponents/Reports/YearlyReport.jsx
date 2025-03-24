import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

import CustomSelect from "../../CustomSelect";
import DownloadReport from "./DownloadReport";
import { CircularProgress } from "@mui/material";
import BarGraphForYearSemReports from "./BarGraphForYearSemReports";
import { 
  getAnnualReportData, 
  getAnnualReportDataByYear,
  getAllAcademicYears 
} from "../../../utils/handleSettingsData";

const ensureNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) ? value : 0;
};

const sanitizeReportData = (data) => {
  if (!data) return null;
  
  return {
    currentYear: ensureNumber(data.current_year),
    memberDataThis: {
      totalMembers: ensureNumber(data.memberDataThis?.totalMembers),
      newMembers: ensureNumber(data.memberDataThis?.newMembers),
      totalActive_members: ensureNumber(data.memberDataThis?.totalActive_members),
      newActive_members: ensureNumber(data.memberDataThis?.newActive_members),
      members: Array.isArray(data.memberDataThis?.members) ? data.memberDataThis.members : [],
    },
    memberDataLast: {
      totalMembers: ensureNumber(data.memberDataLast?.totalMembers),
      newMembers: ensureNumber(data.memberDataLast?.newMembers),
      totalActiveMembers: ensureNumber(data.memberDataLast?.totalActiveMembers),
      newActiveMembers: ensureNumber(data.memberDataLast?.newActiveMembers),
    },
    meetingsDataThis: {
      numMeetings: ensureNumber(data.meetingsDataThis?.numMeetings || data.meetingsDataThisYear?.number_of_meetings),
      numEvents: ensureNumber(data.meetingsDataThis?.numEvents || 
        (Array.isArray(data.meetingsDataThisYear?.meetings) ? data.meetingsDataThisYear.meetings.length : 0)),
      numVolunteering: ensureNumber(data.meetingsDataThis?.numVolunteering),
      totalAttendance: ensureNumber(data.meetingsDataThis?.totalAttendance || data.meetingsDataThisYear?.total_attendance),
    },
    meetingsDataLast: {
      numMeetings: ensureNumber(data.meetingsDataLast?.numMeetings || data.meetingsDataLastYear?.number_of_meetings),
      numEvents: ensureNumber(data.meetingsDataLast?.numEvents || 
        (Array.isArray(data.meetingsDataLastYear?.meetings) ? data.meetingsDataLastYear.meetings.length : 0)),
      numVolunteering: ensureNumber(data.meetingsDataLast?.numVolunteering),
      totalAttendance: ensureNumber(data.meetingsDataLast?.totalAttendance || data.meetingsDataLastYear?.total_attendance),
    },
  };
};

export default function YearlyReport({ orgId, color }) {
  const [loading, setLoading] = React.useState(true);
  const [reportData, setReportData] = React.useState(undefined);
  const [yearList, setYearList] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(undefined);
  const [error, setError] = React.useState(null);

  // Fetch all available years from the database
  const fetchAcademicYears = React.useCallback(async () => {
    try {
      const years = await getAllAcademicYears();
      
      if (years.session === false) {
        // Handle session timeout
        setError("Your session has expired. Please log in again.");
        return;
      }
      
      if (Array.isArray(years) && years.length > 0) {
        setYearList(years);
      } else {
        // Fallback to current year if no years found in DB
        const currentYear = new Date().getFullYear();
        setYearList([currentYear]);
      }
    } catch (err) {
      console.error("Error fetching academic years:", err);
      // Fallback to current year
      const currentYear = new Date().getFullYear();
      setYearList([currentYear]);
    }
  }, []);

  const fetchAnnualReport = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAnnualReportData(orgId);
      
      if (!data) {
        setError("Error loading annual report data");
        setLoading(false);
        return;
      }

      const sanitizedData = sanitizeReportData(data);
      
      if (!sanitizedData) {
        setError("Invalid data format received from server");
        setLoading(false);
        return;
      }

      setReportData(sanitizedData);
      setSelectedYear(sanitizedData.currentYear);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching annual report:", err);
      setError("Failed to load annual report data");
      setLoading(false);
    }
  }, [orgId]);

  const fetchAnnualReportByYear = React.useCallback(async (year) => {
    try {
      setLoading(true);
      const data = await getAnnualReportDataByYear(orgId, year);
      
      if (!data) {
        setError(`Error loading annual report data for ${year}`);
        setLoading(false);
        return;
      }

      const sanitizedData = sanitizeReportData(data);
      
      if (!sanitizedData) {
        setError("Invalid data format received from server");
        setLoading(false);
        return;
      }

      setReportData(sanitizedData);
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching annual report for year ${year}:`, err);
      setError(`Failed to load annual report data for ${year}`);
      setLoading(false);
    }
  }, [orgId]);

  React.useEffect(() => {
    if (orgId) {
      // Fetch both the years list and the current annual report
      Promise.all([fetchAcademicYears(), fetchAnnualReport()])
        .catch(err => {
          console.error("Error during initial data loading:", err);
          setError("Failed to initialize annual report. Please try again later.");
          setLoading(false);
        });
    }
  }, [fetchAcademicYears, fetchAnnualReport, orgId]);

  const handleYearChange = async (year) => {
    if (!year || isNaN(parseInt(year))) {
      console.error("Invalid year selected:", year);
      return;
    }
    
    const yearNum = parseInt(year);
    setSelectedYear(yearNum);
    
    if (yearNum === reportData?.currentYear) {
      // If selecting the current year, use the data we already have
      return;
    }
    
    // Otherwise fetch the data for the selected year
    await fetchAnnualReportByYear(yearNum);
  };

  const isDataValid = reportData && 
    typeof reportData.currentYear === 'number' &&
    reportData.memberDataThis && 
    reportData.memberDataLast;

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      {!isDataValid ? (
        <div className="error-message">No valid report data available</div>
      ) : (
        <div className="yearly-report">
          <h2>Yearly Report</h2>

          <div className="report-pick-and-download">
            <CustomSelect
              label="Year"
              color={color}
              options={yearList}
              startingValue={selectedYear}
              onSelect={handleYearChange}
            />
            <DownloadReport 
              color={color} 
              orgId={orgId} 
              reportType="annual" 
              year={selectedYear}
            />
          </div>

          <div className="yearly-report-content">
            <h3 style={{ color: color }}>{selectedYear}</h3>
            <BarGraphForYearSemReports 
              color={color} 
              data={reportData} 
              isYearly={true} 
            />
          </div>
        </div>
      )}
    </>
  );
}