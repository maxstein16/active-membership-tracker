import * as React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getAnnualReportData, getAnnualReportDataByYear, getSemesterReportData, getMeetingReportData, getSemesterReportDataById } from "../../../utils/handleSettingsData";
import { PieChart, Pie, Cell } from "recharts";
import { createRoot } from "react-dom/client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../../../assets/css/downloadReport.css";

const DownloadReport = ({ color, orgId, reportType, meetingId, year, selectedSemesterId, selectedSemesterName }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info" // 'success', 'error', 'warning', 'info'
  });

  // Function to show notification
  const showNotification = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Function to close notification
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Function to create comparison chart for member or event data
  const createComparisonChart = (data, timeframeName, color, chartTitle, dataItems) => {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{chartTitle}</h3>
        <div className="flex-column-gap">
          {dataItems.map((item, index) => (
            <div key={index} className="flex-column">
              <div className="bar-label">{item.name}</div>
              <div className="bar-container">
                <div 
                  className="bar-current"
                  style={{ 
                    width: `${Math.min(Math.max(item.current * (item.scaleFactor || 5), 20), 400)}px`,
                    backgroundColor: color
                  }}
                >
                  {item.current}
                </div>
                <div 
                  className="bar-previous"
                  style={{ 
                    width: `${Math.min(Math.max(item.previous * (item.scaleFactor || 5), 20), 400)}px`
                  }}
                >
                  {item.previous}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-box" style={{ backgroundColor: color }}></div>
            <span>This {timeframeName}</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ backgroundColor: "#D0D3D4" }}></div>
            <span>Last {timeframeName}</span>
          </div>
        </div>
      </div>
    );
  };

  // Function to create member data chart
  const createMemberDataChart = (data, timeframeName, color) => {
    const memberDataItems = [
      { name: "Total Members", current: data.memberDataThis.totalMembers, previous: data.memberDataLast.totalMembers },
      { name: "New Members", current: data.memberDataThis.newMembers, previous: data.memberDataLast.newMembers },
      { name: "Total Active Members", current: data.memberDataThis.totalActive_members, previous: data.memberDataLast.totalActiveMembers || data.memberDataLast.totalActive_members },
      { name: "New Active Members", current: data.memberDataThis.newActive_members, previous: data.memberDataLast.newActiveMembers || data.memberDataLast.newActive_members }
    ];

    return createComparisonChart(data, timeframeName, color, "Member Data Comparison", memberDataItems);
  };

  // Function to create event data chart
  const createEventDataChart = (data, timeframeName, color) => {
    const eventDataItems = [
      { name: "Number of Meetings", current: data.meetingsDataThis.numMeetings, previous: data.meetingsDataLast.numMeetings, scaleFactor: 2 },
      { name: "Number of Events", current: data.meetingsDataThis.numEvents, previous: data.meetingsDataLast.numEvents, scaleFactor: 2 },
      { name: "Number Volunteering", current: data.meetingsDataThis.numVolunteering, previous: data.meetingsDataLast.numVolunteering, scaleFactor: 2 },
      { name: "Total Attendance", current: data.meetingsDataThis.totalAttendance, previous: data.meetingsDataLast.totalAttendance, scaleFactor: 2 }
    ];

    return createComparisonChart(data, timeframeName, color, "Event Data Comparison", eventDataItems);
  };

  // Function to create attendance pie chart for meeting reports
  const createMeetingAttendancePieChart = (data, color) => {
    const pieData = [
      { name: "Active Members", value: data.attendance.active_member_attendance || 0 },
      { name: "Inactive Members", value: data.attendance.inactive_member_attendance || 0 }
    ];

    // Only show the pie chart if there's attendance
    if (pieData[0].value === 0 && pieData[1].value === 0) {
      return (
        <div className="chart-container">
          <h3 className="chart-title">No attendance data available</h3>
        </div>
      );
    }

    return (
      <div className="chart-container">
        <h3 className="chart-title">Attendance Breakdown</h3>
        <div className="pie-chart-container">
          <PieChart width={200} height={200}>
            <Pie
              data={pieData}
              cx={100}
              cy={100}
              innerRadius={0}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              <Cell key="active" fill={color} />
              <Cell key="inactive" fill="#D0D3D4" />
            </Pie>
          </PieChart>
        </div>
        <div className="legend-container center-legend">
          <div className="legend-item">
            <div className="legend-box" style={{ backgroundColor: color }}></div>
            <span>Active Members: {pieData[0].value}</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ backgroundColor: "#D0D3D4" }}></div>
            <span>Inactive Members: {pieData[1].value}</span>
          </div>
        </div>
      </div>
    );
  };

  // Function to create a member table
  const createMemberTable = (members, threshold) => {
    return (
      <table className="report-table">
        <thead>
          <tr className="table-header">
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Email</th>
            <th className="table-header-cell">Points</th>
            <th className="table-header-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => {
            const isActive = member.points >= (threshold || 0);
            
            return (
              <tr key={index} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                <td className="table-cell">{member.firstName} {member.lastName}</td>
                <td className="table-cell">{member.rit_username}@rit.edu</td>
                <td className="table-cell">{member.points}</td>
                <td className="table-cell">
                  <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Function to create an attendee table
  const createAttendeeTable = (attendees) => {
    return (
      <table className="report-table">
        <thead>
          <tr className="table-header">
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Email</th>
          </tr>
        </thead>
        <tbody>
          {attendees && attendees.length > 0 ? (
            attendees.map((member, index) => (
              <tr key={index} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                <td className="table-cell">{member.firstName} {member.lastName}</td>
                <td className="table-cell">{member.rit_username}@rit.edu</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="table-cell" style={{ textAlign: 'center' }}>
                No attendance data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  // Prepare data structure for annual/semester reports
  const prepareReportData = (reportData, reportType) => {
    return {
      memberDataThis: {
        totalMembers: reportType === "annual" 
          ? reportData.memberDataThis?.totalMembers 
          : reportData.member_data?.total_members,
        newMembers: reportType === "annual" 
          ? reportData.memberDataThis?.newMembers 
          : reportData.member_data?.new_members,
        totalActive_members: reportType === "annual" 
          ? reportData.memberDataThis?.totalActive_members 
          : reportData.member_data?.active_members,
        newActive_members: reportType === "annual" 
          ? reportData.memberDataThis?.newActive_members 
          : reportData.member_data?.new_active_members
      },
      memberDataLast: {
        totalMembers: reportType === "annual" 
          ? reportData.memberDataLast?.totalMembers 
          : reportData.previous_semester?.total_members,
        newMembers: reportType === "annual" 
          ? reportData.memberDataLast?.newMembers 
          : reportData.previous_semester?.new_members,
        totalActiveMembers: reportType === "annual" 
          ? reportData.memberDataLast?.totalActiveMembers 
          : reportData.previous_semester?.active_members,
        newActiveMembers: reportType === "annual" 
          ? reportData.memberDataLast?.newActiveMembers 
          : reportData.previous_semester?.new_active_members
      },
      meetingsDataThis: {
        numMeetings: reportType === "annual" 
          ? reportData.meetingsDataThis?.numMeetings 
          : reportData.event_data?.general_meetings,
        numEvents: reportType === "annual" 
          ? reportData.meetingsDataThis?.numEvents 
          : reportData.event_data?.events,
        numVolunteering: reportType === "annual" 
          ? reportData.meetingsDataThis?.numVolunteering 
          : reportData.event_data?.volunteering_events,
        totalAttendance: reportType === "annual" 
          ? reportData.meetingsDataThis?.totalAttendance 
          : reportData.event_data?.total_attendance
      },
      meetingsDataLast: {
        numMeetings: reportType === "annual" 
          ? reportData.meetingsDataLast?.numMeetings 
          : reportData.previous_semester?.general_meetings,
        numEvents: reportType === "annual" 
          ? reportData.meetingsDataLast?.numEvents 
          : reportData.previous_semester?.events,
        numVolunteering: reportType === "annual" 
          ? reportData.meetingsDataLast?.numVolunteering 
          : reportData.previous_semester?.volunteering_events,
        totalAttendance: reportType === "annual" 
          ? reportData.meetingsDataLast?.totalAttendance 
          : reportData.previous_semester?.total_attendance
      }
    };
  };

  // Generate filename for the report
  const generateReportFilename = (reportData, reportType) => {
    let reportFilename = `${reportType}_report`;
    if (reportType === "annual") {
      const yearValue = reportData.current_year || year || new Date().getFullYear();
      reportFilename += `_${yearValue}`;
    } else if (reportType === "semester") {
      // Safely handle semester name by replacing spaces with underscores and ensuring it exists
      const semesterValue = (reportData.semester_name || selectedSemesterName || "current").replace(/\s+/g, '_');
      reportFilename += `_${semesterValue}`;
    } else if (reportType === "meeting") {
      reportFilename += `_${reportData.meeting_name?.replace(/\s+/g, '_') || meetingId}`;
    }
    return reportFilename + ".pdf";
  };

  // Function to format and render report in the DOM temporarily for capture
  const renderReportForCapture = async (reportData, reportType) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    let reportComponent;
    const timeframeName = reportType === "annual" ? "year" : "semester";
    
    if (reportType === "annual" || reportType === "semester") {
      // Prepare data for charts
      const data = prepareReportData(reportData, reportType);

      reportComponent = (
        <div className="report-container">
          <h1 className="report-title" style={{ borderBottom: `2px solid ${color}` }}>
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </h1>
          <div className="meta-info">
            <p><strong>Organization:</strong> {reportData.organization_name}</p>
            <p><strong>Abbreviation:</strong> {reportData.organization_abbreviation}</p>
            {reportType === "annual" ? (
              <p><strong>Year:</strong> {reportData.current_year || year}</p>
            ) : (
              <>
                <p><strong>Semester:</strong> {reportData.semester_name || selectedSemesterName}</p>
                <p><strong>Academic Year:</strong> {reportData.academic_year || `${selectedSemesterName?.split(' ')[0]}`}</p>
              </>
            )}
          </div>

          <h2 className="section-title" style={{ color }}>Membership Data</h2>
          {createMemberDataChart(data, timeframeName, color)}

          <h2 className="section-title" style={{ color }}>Event Data</h2>
          {createEventDataChart(data, timeframeName, color)}

          {reportType === "semester" && reportData.member_data?.members && (
            <>
              <h2 className="section-title" style={{ color }}>Member List</h2>
              {createMemberTable(reportData.member_data.members, reportData.threshold)}
            </>
          )}
        </div>
      );
    } else if (reportType === "meeting") {
      reportComponent = (
        <div className="report-container">
          <h1 className="report-title" style={{ borderBottom: `2px solid ${color}` }}>
            Meeting Report
          </h1>
          <div className="meta-info">
            <p><strong>Organization:</strong> {reportData.organization_name}</p>
            <p><strong>Abbreviation:</strong> {reportData.organization_abbreviation}</p>
            <p><strong>Meeting Name:</strong> {reportData.meeting_name}</p>
            <p><strong>Type:</strong> {reportData.meeting_type?.charAt(0).toUpperCase() + reportData.meeting_type?.slice(1) || "N/A"}</p>
            <p><strong>Date:</strong> {new Date(reportData.meeting_date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {reportData.meeting_location}</p>
            <p><strong>Description:</strong> {reportData.meeting_description}</p>
          </div>

          <h2 className="section-title" style={{ color }}>Attendance Overview</h2>
          <div className="stat-card-container">
            <div className="stat-card">
              <div className="stat-value" style={{ color }}>
                {reportData.attendance?.total_attendance || 0}
              </div>
              <div className="stat-label">Total Attendance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#2e7d32' }}>
                {reportData.attendance?.active_member_attendance || 0}
              </div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#c62828' }}>
                {reportData.attendance?.inactive_member_attendance || 0}
              </div>
              <div className="stat-label">Inactive Members</div>
            </div>
          </div>

          {createMeetingAttendancePieChart(reportData, color)}

          <h2 className="section-title" style={{ color }}>Attendees</h2>
          {createAttendeeTable(reportData.attendance?.members_who_attended)}
        </div>
      );
    }

    const root = createRoot(container);
    await new Promise(resolve => {
      root.render(reportComponent);
      setTimeout(resolve, 100); // Give time for rendering
    });

    return container;
  };

  // Handle adding pages and footer to PDF
  const addPdfFooters = (pdf, reportData) => {
    const totalPages = pdf.getNumberOfPages();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(reportData.organization_name, 10, pdfHeight - 10);
      pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - 50, pdfHeight - 10);
    }
    
    return pdf;
  };

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      let reportData;

      // Fetch the appropriate report data based on report type and selection
      if (reportType === "annual") {
        // Check if a specific year is provided and different from current year
        const currentYear = new Date().getFullYear();
        if (year && year !== currentYear) {
          // Use getAnnualReportDataByYear for specific years
          reportData = await getAnnualReportDataByYear(orgId, year);
        } else {
          // Use getAnnualReportData for current year
          reportData = await getAnnualReportData(orgId);
        }
        
        // Ensure year is set in the report data
        if (reportData && year) {
          reportData.current_year = year;
        }
      } else if (reportType === "semester") {
        // Use selectedSemesterId if provided, otherwise fetch current semester
        if (selectedSemesterId) {
          reportData = await getSemesterReportDataById(orgId, selectedSemesterId);
          
          // Ensure the semester name is added to the report data
          if (reportData && selectedSemesterName) {
            reportData.semester_name = selectedSemesterName;
          }
        } else {
          reportData = await getSemesterReportData(orgId);
        }
      } else if (reportType === "meeting") {
        if (!meetingId) {
          showNotification("Missing meeting ID for meeting report.", "error");
          setIsDownloading(false);
          return;
        }
        reportData = await getMeetingReportData(orgId, meetingId);
      } else {
        showNotification("Invalid report type.", "error");
        setIsDownloading(false);
        return;
      }

      // Check if we have a valid reportData
      if (!reportData) {
        showNotification("Error fetching report data.", "error");
        setIsDownloading(false);
        return;
      }
      
      // Ensure organization name is present
      if (!reportData.organization_name) {
        reportData.organization_name = "Organization";
      }

      // Render the report component to a temporary DOM container
      const container = await renderReportForCapture(reportData, reportType);
      
      try {
        // Create a PDF document
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Capture the rendered component
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate dimensions to fit the page properly
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 30) / imgHeight);
        
        // Add the image to the PDF
        pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth * ratio, imgHeight * ratio);
        
        // Add footers with page numbers
        addPdfFooters(pdf, reportData);
        
        // Generate appropriate filename and save the PDF
        const filename = generateReportFilename(reportData, reportType);
        pdf.save(filename);
        
        showNotification("Report successfully downloaded!", "success");
      } finally {
        // Clean up temporary DOM elements
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
        }
        setIsDownloading(false);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification("Failed to generate the report.", "error");
      setIsDownloading(false);
    }
  };

  return (
    <>
      <button
        className="custom-color-button download-button"
        style={{ 
          backgroundColor: color, 
          borderColor: color,
          opacity: isDownloading ? 0.7 : 1,
          cursor: isDownloading ? 'wait' : 'pointer'
        }}
        onClick={downloadReport}
        disabled={isDownloading}
      >
        {isDownloading ? "Generating PDF..." : "Download Report"}
      </button>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DownloadReport;