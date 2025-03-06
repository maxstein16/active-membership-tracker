import * as React from "react";
import jsPDF from "jspdf";
import { getAnnualReportData, getSemesterReportData, getMeetingReportData } from "../../../utils/handleSettingsData";

export default function DownloadReport({ color, orgId, reportType, meetingId }) {
  const downloadReport = async () => {
    try {
      let reportData;

      if (reportType === "annual") {
        reportData = await getAnnualReportData(orgId);
      } else if (reportType === "semester") {
        reportData = await getSemesterReportData(orgId);
      } else if (reportType === "meeting") {
        if (!meetingId) {
          alert("Missing meeting ID for meeting report.");
          return;
        }
        reportData = await getMeetingReportData(orgId, meetingId);
      } else {
        alert("Invalid report type.");
        return;
      }

      if (!reportData || !reportData.organization_name) {
        alert("Error fetching report data.");
        return;
      }

      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text(`${reportType.toUpperCase()} REPORT`, 10, 10);
      pdf.setFontSize(12);
      pdf.text(`Organization: ${reportData.organization_name}`, 10, 20);
      pdf.text(`Abbreviation: ${reportData.organization_abbreviation}`, 10, 30);

      if (reportType === "annual") {
        pdf.text(`Year: ${reportData.current_year}`, 10, 40);
        const meetingsData = reportData.meetings_data_this_year || {};
        pdf.text(`Total Meetings Held: ${meetingsData.number_of_meetings || 0}`, 10, 50);
        pdf.text(`Total Attendance: ${meetingsData.total_attendance || 0}`, 10, 60);
      }

      if (reportType === "semester") {
        pdf.text(`Semester: ${reportData.semester}`, 10, 40);
        pdf.text(`Academic Year: ${reportData.academic_year}`, 10, 50);
        const memberData = reportData.member_data || {};
        pdf.text(`Total Members: ${memberData.total_members || 0}`, 10, 60);
        pdf.text(`Active Members: ${memberData.active_members || 0}`, 10, 70);
        pdf.text(`Total Events: ${reportData.event_data.total_events || 0}`, 10, 80);
        pdf.text(`Total Attendance: ${reportData.event_data.total_attendance || 0}`, 10, 90);
      }

      if (reportType === "meeting") {
        pdf.text(`Meeting Name: ${reportData.meeting_name}`, 10, 40);
        pdf.text(`Type: ${reportData.meeting_type.charAt(0).toUpperCase() + reportData.meeting_type.slice(1)}`, 10, 50);
        pdf.text(`Date: ${new Date(reportData.meeting_date).toLocaleString()}`, 10, 60);
        pdf.text(`Location: ${reportData.meeting_location}`, 10, 70);
        pdf.text(`Description: ${reportData.meeting_description}`, 10, 80);

        const attendanceData = reportData.attendance || {};
        pdf.text(`Total Attendance: ${attendanceData.total_attendance || 0}`, 10, 90);
        pdf.text(`Active Members Attended: ${attendanceData.active_member_attendance || 0}`, 10, 100);
        pdf.text(`Inactive Members Attended: ${attendanceData.inactive_member_attendance || 0}`, 10, 110);

        pdf.text(`Members Who Attended:`, 10, 120);
        let yOffset = 130;
        attendanceData.members_who_attended.forEach((member, index) => {
          pdf.text(
            `${index + 1}. ${member.firstName} ${member.lastName} - ${member.rit_username}@rit.edu`,
            15,
            yOffset
          );
          yOffset += 10;
        });
      }

      pdf.save(`${reportType}_report_${reportData.current_year || reportData.semester || reportData.meeting_name || "N/A"}.pdf`);
      alert("Report successfully downloaded!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate the report.");
    }
  };

  return (
    <button
      className="custom-color-button"
      style={{ backgroundColor: color, borderColor: color }}
      onClick={downloadReport}
    >
      Download Report
    </button>
  );
}
