import * as React from "react";
import "../../../assets/css/constants.css";
import "../../../assets/css/pageSetup.css";
import "../../../assets/css/general.css";
import "../../../assets/css/memberPages.css";

import CustomSelect from "../../CustomSelect";
import DownloadReport from "./DownloadReport";
import { CircularProgress } from "@mui/material";
import BarGraphForYearSemReports from "./BarGraphForYearSemReports";
import { getSemesterReportData } from "../../../utils/handleSettingsData";
import MemberTable from "../MemberTable";

export default function SemesterReport({ orgId, color }) {
  const [reportData, setReportData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [yearList, setYearList] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(undefined);

  const fetchSemesterReport = async () => {
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
      
      setSelectedYear(`${data.academic_year} ${data.semester}`);
      
      generateYearList(data.academic_year);
      
    } catch (err) {
      console.error("Error fetching semester report:", err);
      setError("Failed to load semester report data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateYearList = (currentAcademicYear) => {
    const currentYear = new Date().getFullYear();
    const earliestYear = 2018;
    
    let possibleYears = [];
    for (let i = currentYear; i >= earliestYear; i--) {
      possibleYears.push(`${i} Spring`);
      possibleYears.push(`${i} Fall`);
    }
    setYearList(possibleYears);
  };

  const handleSemesterChange = (value) => {
    setSelectedYear(value);
    // this needs implementation, we would fetch the data for the selected semester
    // This would require an API endpoint that accepts a semester parameter
    // fetchSemesterReportByYearAndSemester(value.split(' ')[0], value.split(' ')[1]);
  };

  // Load initial data on component mount
  React.useEffect(() => {
    fetchSemesterReport();
  }, [orgId]);

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
          options={yearList}
          startingValue={selectedYear}
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
          <h3 style={{ color: color }}>{selectedYear}</h3>
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