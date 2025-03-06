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

      if (reportType === "semester") {
        pdf.text(`Semester: ${reportData.semester}`, 10, 40);
        pdf.text(`Academic Year: ${reportData.academic_year}`, 10, 50);

        const memberData = reportData.member_data || {};
        pdf.text(`Total Members: ${memberData.total_members || 0}`, 10, 60);
        pdf.text(`Active Members: ${memberData.active_members || 0}`, 10, 70);

        pdf.text(`Members:`, 10, 80);
        let yOffset = 90;
        memberData.members.forEach((member, index) => {
          pdf.text(`${index + 1}. ${member.firstName} ${member.lastName} - ${member.points} points`, 15, yOffset);
          yOffset += 10;
        });

        const eventData = reportData.event_data || {};
        pdf.text(`Total Events: ${eventData.total_events || 0}`, 10, yOffset + 10);
        pdf.text(`Total Attendance: ${eventData.total_attendance || 0}`, 10, yOffset + 20);
      }

      pdf.save(`${reportType}_report_${reportData.semester || "N/A"}.pdf`);
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
