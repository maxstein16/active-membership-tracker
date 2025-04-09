import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

import CustomSelect from "../../CustomSelect";
import DownloadReport from "./DownloadReport";
import { CircularProgress } from "@mui/material";
import BarGraphForYearSemReports from "./BarGraphForYearSemReports";
import { getSemesterReportData, getAllSemestersAcrossYears, getSemesterReportDataById } from "../../../utils/handleSettingsData";
import MemberTable from "../MemberTable";

export default function SemesterReport({ orgId, color }) {
  const [reportData, setReportData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [semesterList, setSemesterList] = React.useState([]);
  const [selectedSemester, setSelectedSemester] = React.useState("");
  const [selectedSemesterId, setSelectedSemesterId] = React.useState(null);

  // Fetch all semesters from the database
  // Store the full semester data for lookup purposes
  const [allSemestersData, setAllSemestersData] = React.useState([]);
  
  const fetchAllSemesters = React.useCallback(async () => {
    try {
      const semesters = await getAllSemestersAcrossYears(orgId);
      
      if (Array.isArray(semesters) && semesters.length > 0) {
        // Store the full semesters data for reference
        setAllSemestersData(semesters);
        
        const sortedSemesters = [...semesters].sort((a, b) => {
          const yearA = parseInt(a.semester_name.split(' ')[0]);
          const yearB = parseInt(b.semester_name.split(' ')[0]);
          
          if (yearB !== yearA) {
            return yearB - yearA;
          }
          
          const semA = a.semester_name.split(' ')[1];
          const semB = b.semester_name.split(' ')[1];
          
          if (semA === 'FALL' && semB === 'SPRING') {
            return -1;
          } else if (semA === 'SPRING' && semB === 'FALL') {
            return 1;
          }
          
          return 0;
        });
        
        const formattedSemesters = sortedSemesters.map(sem => 
          `${sem.semester_name}`
        );
        
        setSemesterList(formattedSemesters);
        
        if (!selectedSemester && formattedSemesters.length > 0) {
          setSelectedSemester(formattedSemesters[0]);
          
          // Set the semester ID for the first item
          const firstSemester = sortedSemesters[0];
          if (firstSemester && firstSemester.semester_id) {
            setSelectedSemesterId(firstSemester.semester_id);
          }
        }
      } else {
        setError("No semesters found in the system.");
      }
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setError("Failed to load semester options. Please try again later.");
    }
  }, [selectedSemester, orgId]);

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
      
      if (data.semester_name && (!selectedSemester || selectedSemester === "")) {
        setSelectedSemester(data.semester_name);
      }
      
      // Set the semester ID for the current semester
      if (data.semester_id) {
        setSelectedSemesterId(data.semester_id);
      }
      
    } catch (err) {
      console.error("Error fetching semester report:", err);
      setError("Failed to load semester report data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [orgId, selectedSemester]);

  const fetchSemesterReportBySemester = React.useCallback(async (selectedSemesterValue) => {
    if (!selectedSemesterValue) {
      console.error("No semester selected for report fetch");
      return;
    }
    
    setIsLoading(true);
    try {
      const allSemesters = await getAllSemestersAcrossYears(orgId);
      
      const selectedSemInfo = allSemesters.find(sem => 
        sem.semester_name === selectedSemesterValue
      );
      
      if (!selectedSemInfo || !selectedSemInfo.semester_id) {
        throw new Error(`Could not find semester: ${selectedSemesterValue}`);
      }
      
      // Update the selected semester ID
      setSelectedSemesterId(selectedSemInfo.semester_id);
      
      const data = await getSemesterReportDataById(orgId, selectedSemInfo.semester_id);
      
      if (!data) {
        throw new Error("Failed to fetch semester report data");
      }
      
      const formattedData = {
        currentYear: selectedSemInfo.academic_year,
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
    if (value && value !== selectedSemester) {
      setSelectedSemester(value);
      
      // Find the matching semester to get its ID
      if (allSemestersData.length > 0) {
        const selectedSemesterData = allSemestersData.find(sem => sem.semester_name === value);
        if (selectedSemesterData && selectedSemesterData.semester_id) {
          setSelectedSemesterId(selectedSemesterData.semester_id);
        }
      }
      
      fetchSemesterReportBySemester(value);
    }
  };

  // Load initial data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchAllSemesters();
      
      if (!reportData) {
        await fetchSemesterReport();
      }
      setIsLoading(false);
    };
    
    loadData().catch(err => {
      console.error("Error during initial data loading:", err);
      setError("Failed to initialize semester report. Please try again later.");
      setIsLoading(false);
    });
  }, [fetchAllSemesters, fetchSemesterReport, reportData]);

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
        {semesterList.length > 0 && (
          <CustomSelect
            label="Semester"
            color={color}
            options={semesterList}
            startingValue={selectedSemester || semesterList[0]}
            onSelect={handleSemesterChange}
          />
        )}
        <DownloadReport 
          color={color} 
          orgId={orgId} 
          reportType="semester"
          selectedSemesterId={selectedSemesterId}
          selectedSemesterName={selectedSemester}
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