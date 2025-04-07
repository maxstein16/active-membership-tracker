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
    memberDataLast: data.memberDataLast ? {
      totalMembers: ensureNumber(data.memberDataLast?.totalMembers),
      newMembers: ensureNumber(data.memberDataLast?.newMembers),
      totalActiveMembers: ensureNumber(data.memberDataLast?.totalActiveMembers),
      newActiveMembers: ensureNumber(data.memberDataLast?.newActiveMembers),
    } : null,
    meetingsDataThis: {
      numMeetings: ensureNumber(data.meetingsDataThis?.numMeetings || data.meetingsDataThisYear?.number_of_meetings),
      numEvents: ensureNumber(data.meetingsDataThis?.numEvents || 
        (Array.isArray(data.meetingsDataThisYear?.meetings) ? data.meetingsDataThisYear.meetings.length : 0)),
      numVolunteering: ensureNumber(data.meetingsDataThis?.numVolunteering),
      totalAttendance: ensureNumber(data.meetingsDataThis?.totalAttendance || data.meetingsDataThisYear?.total_attendance),
    },
    meetingsDataLast: data.meetingsDataLast ? {
      numMeetings: ensureNumber(data.meetingsDataLast?.numMeetings || data.meetingsDataLastYear?.number_of_meetings),
      numEvents: ensureNumber(data.meetingsDataLast?.numEvents || 
        (Array.isArray(data.meetingsDataLastYear?.meetings) ? data.meetingsDataLastYear.meetings.length : 0)),
      numVolunteering: ensureNumber(data.meetingsDataLast?.numVolunteering),
      totalAttendance: ensureNumber(data.meetingsDataLast?.totalAttendance || data.meetingsDataLastYear?.total_attendance),
    } : null,
    isNewOrg: data.isNewOrg || false
  };
};

// Helper function to safely format a year value
const formatYearValue = (year) => {
  if (typeof year === 'number') {
    return year;
  } else if (typeof year === 'string') {
    if (year.includes('-')) {
      return parseInt(year.split('-')[0]);
    } else {
      return parseInt(year);
    }
  }
  return null;
};

export default function YearlyReport({ orgId, color }) {
  const [loading, setLoading] = React.useState(true);
  const [reportData, setReportData] = React.useState(undefined);
  const [yearList, setYearList] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(undefined);
  const [error, setError] = React.useState(null);
  const [isNewOrg, setIsNewOrg] = React.useState(false);

  // Fetch only the years after the organization was created
  const fetchAcademicYears = React.useCallback(async () => {
    try {
      // Get years filtered by organization creation date
      const years = await getAllAcademicYears(orgId);
      
      if (years && years.session === false) {
        setError("Your session has expired. Please log in again.");
        return;
      }
      
      if (Array.isArray(years) && years.length > 0) {
        setYearList(years);
      } else {
        // Fallback to current year if no years found
        const currentYear = new Date().getFullYear();
        setYearList([currentYear]);
      }
    } catch (err) {
      console.error("Error fetching academic years:", err);
      const currentYear = new Date().getFullYear();
      setYearList([currentYear]);
    }
  }, [orgId]);

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

      // Set the isNewOrg flag to properly handle display
      setIsNewOrg(sanitizedData.isNewOrg || false);
      
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

      // Update isNewOrg status for this year
      setIsNewOrg(sanitizedData.isNewOrg || false);
      
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
    if (!year) {
      console.error("Invalid year selected:", year);
      return;
    }
    
    // Parse the year value safely
    const yearNum = formatYearValue(year);
    
    if (yearNum === null || isNaN(yearNum)) {
      console.error("Could not parse year:", year);
      return;
    }
    
    setSelectedYear(yearNum);
    
    if (yearNum === reportData?.currentYear) {
      // If selecting the current year, use the data we already have
      return;
    }
    
    // Otherwise fetch the data for the selected year
    await fetchAnnualReportByYear(yearNum);
  };

  // New organizations might not have historical data, so we need to be careful about validation
  const isDataValid = reportData && 
    typeof reportData.currentYear === 'number' &&
    reportData.memberDataThis;

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Handle the case where we have no years in the yearList
  if (yearList.length === 0) {
    return <div className="error-message">No data available for this organization</div>;
  }

  return (
    <>
      {!isDataValid ? (
        <div className="error-message">No valid report data available</div>
      ) : (
        <div className="yearly-report">
          <h2>Yearly Report</h2>

          <div className="report-pick-and-download">
            {yearList.length > 0 && (
              <CustomSelect
                label="Year"
                color={color}
                options={yearList}
                startingValue={selectedYear || formatYearValue(yearList[0]) || ""}
                onSelect={handleYearChange}
              />
            )}
            <DownloadReport 
              color={color} 
              orgId={orgId} 
              reportType="annual" 
              year={selectedYear}
            />
          </div>

          <div className="yearly-report-content">
            <h3 style={{ color: color }}>{selectedYear}</h3>
            
            {isNewOrg ? (
              <div className="info-message">
                <p>This organization is new or no historical data is available for comparison.</p>
                <p>Only current year data will be displayed.</p>
              </div>
            ) : null}
            
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