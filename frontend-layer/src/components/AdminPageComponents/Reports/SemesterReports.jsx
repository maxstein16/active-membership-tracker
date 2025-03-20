import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

import CustomSelect from "../../CustomSelect";
import DownloadReport from "./DownloadReport";
import { CircularProgress } from "@mui/material";
import BarGraphForYearSemReports from "./BarGraphForYearSemReports";
import { getSemesterReportData, getAllSemesters, getSemesterReportDataById } from "../../../utils/handleSettingsData";
import MemberTable from "../MemberTable";

export default function SemesterReport({ orgId, color }) {
  const [reportData, setReportData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [semesterList, setSemesterList] = React.useState([]);
  const [selectedSemester, setSelectedSemester] = React.useState(undefined);

  // Fetch all semesters from the database
  const fetchAllSemesters = React.useCallback(async () => {
    try {
      const semesters = await getAllSemesters();
      
      if (semesters.session === false) {
        // Handle session timeout
        setError("Your session has expired. Please log in again.");
        return;
      }
      
      if (Array.isArray(semesters)) {
        // Format semesters for dropdown: just "Year Semester" without academic_year
        const formattedSemesters = semesters.map(sem => 
          `${sem.semester_name}`  // Just use the semester_name which should already include the year
        );
        
        setSemesterList(formattedSemesters);
      }
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setError("Failed to load semester options. Please try again later.");
    }
  }, []);

  const fetchSemesterReport = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSemesterReportData(orgId);
      
      if (!data) {
        throw new Error("Failed to fetch semester report data");
      }
      
      const formattedData = {
        currentYear: new Date().getFullYear(),
        currentSemesterStart: data.semester_start_date || '',
        currentSemesterEnd: data.semester_end_date || '',
        memberDataThis: {
          totalMembers: data.member_data?.total_members || 0,
          newMembers: data.member_data?.new_members || 0,
          totalActive_members: data.member_data?.active_members || 0,
          newActive_members: data.member_data?.new_active_members || 0,
          members: data.member_data?.members || [],
        },
        memberDataLast: {
          totalMembers: data.previous_semester?.total_members || 0,
          newMembers: data.previous_semester?.new_members || 0,
          totalActiveMembers: data.previous_semester?.active_members || 0,
          newActiveMembers: data.previous_semester?.new_active_members || 0,
        },
        meetingsDataThis: {
          numMeetings: data.event_data?.general_meetings || 0,
          numEvents: data.event_data?.events || 0,
          numVolunteering: data.event_data?.volunteering_events || 0,
          totalAttendance: data.event_data?.total_attendance || 0,
        },
        meetingsDataLast: {
          numMeetings: data.previous_semester?.general_meetings || 0,
          numEvents: data.previous_semester?.events || 0,
          numVolunteering: data.previous_semester?.volunteering_events || 0,
          totalAttendance: data.previous_semester?.total_attendance || 0,
        },
      };
      
      setReportData(formattedData);
      
      // Set the current semester name (without academic year) as selected
      setSelectedSemester(data.semester_name);
      
    } catch (err) {
      console.error("Error fetching semester report:", err);
      setError("Failed to load semester report data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  // Function to fetch semester report data for a specific semester
  const fetchSemesterReportBySemester = React.useCallback(async (selectedSemesterValue) => {
    setIsLoading(true);
    try {
      // Get all semesters
      const allSemesters = await getAllSemesters();
      
      // Find the semester that matches the selected name
      const selectedSemester = allSemesters.find(sem => 
        sem.semester_name === selectedSemesterValue
      );
      
      if (!selectedSemester || !selectedSemester.semester_id) {
        throw new Error(`Could not find semester: ${selectedSemesterValue}`);
      }
      
      // Use the semester ID to get the report using the new function
      const data = await getSemesterReportDataById(orgId, selectedSemester.semester_id);
      
      if (!data) {
        throw new Error("Failed to fetch semester report data");
      }
      
      // Format data for the component
      const formattedData = {
        currentYear: selectedSemester.academic_year,
        currentSemesterStart: data.semester_start_date || '',
        currentSemesterEnd: data.semester_end_date || '',
        memberDataThis: {
          totalMembers: data.member_data?.total_members || 0,
          newMembers: data.member_data?.new_members || 0,
          totalActive_members: data.member_data?.active_members || 0,
          newActive_members: data.member_data?.new_active_members || 0,
          members: data.member_data?.members || [],
        },
        memberDataLast: {
          totalMembers: data.previous_semester?.total_members || 0,
          newMembers: data.previous_semester?.new_members || 0,
          totalActiveMembers: data.previous_semester?.active_members || 0,
          newActiveMembers: data.previous_semester?.new_active_members || 0,
        },
        meetingsDataThis: {
          numMeetings: data.event_data?.general_meetings || 0,
          numEvents: data.event_data?.events || 0,
          numVolunteering: data.event_data?.volunteering_events || 0,
          totalAttendance: data.event_data?.total_attendance || 0,
        },
        meetingsDataLast: {
          numMeetings: data.previous_semester?.general_meetings || 0,
          numEvents: data.previous_semester?.events || 0,
          numVolunteering: data.previous_semester?.volunteering_events || 0,
          totalAttendance: data.previous_semester?.total_attendance || 0,
        },
      };
      
      setReportData(formattedData);
      
    } catch (err) {
      console.error("Error fetching semester report for specific semester:", err);
      setError(`Failed to load data for ${selectedSemesterValue}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    fetchSemesterReportBySemester(value);
  };

  // Load initial data on component mount
  React.useEffect(() => {
    // Fetch both semesters list and current semester report
    Promise.all([fetchAllSemesters(), fetchSemesterReport()])
      .catch(err => {
        console.error("Error during initial data loading:", err);
        setError("Failed to initialize semester report. Please try again later.");
        setIsLoading(false);
      });
  }, [fetchAllSemesters, fetchSemesterReport]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress style={{ color: color }} />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="semester-report">
      <h2>Semester Report</h2>

      <div className="report-pick-and-download">
        <CustomSelect
          label="Semester"
          color={color}
          options={semesterList}
          startingValue={selectedSemester}
          onSelect={handleSemesterChange}
        />
        <DownloadReport 
          color={color} 
          orgId={orgId} 
          reportType="semester" 
        />
      </div>

      {reportData && (
        <div className="semester-report-content">
          <h3 style={{ color: color }}>{selectedSemester}</h3>
          <BarGraphForYearSemReports color={color} data={reportData} isYearly={false} />
          
          {reportData.memberDataThis.members && reportData.memberDataThis.members.length > 0 && (
            <div className="member-list-section">
              <h4>Members This Semester</h4>
              <MemberTable 
                color={color}
                orgId={orgId}
                membersList={reportData.memberDataThis.members.map(member => ({
                  member_id: member.member_id,
                  membership_id: member.membership_id || null,
                  membership_role: member.role_num,
                  membership_points: member.points,
                  active_member: member.points >= (reportData.threshold || 0),
                  member_name: `${member.firstName} ${member.lastName}`,
                  member_email: `${member.rit_username}@rit.edu`,
                  member_major: member.major || "",
                  member_graduation_date: member.graduation_date || ""
                }))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}