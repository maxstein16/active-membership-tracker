const schedule = require("node-schedule");
const { sendEmail } = require("../service-layer/emailService");
const {
  annualReportEmail,
  semesterReportEmail,
  statusReportEmail,
  activeMembershipEmail,
} = require("./public/emailTemplates");
const {
  Membership,
  Attendance,
} = require("../db");
const {
  getOrganizationEmailSettingsInDB,
} = require("./organizationSettingsProcessing");
const { getSpecificOrgDataInDB } = require("./organizationProcessing");
const { getCurrentSemester } = require("../data-layer/semester");
const {
  getAllMembershipsInOrganizationInDB,
} = require("./organizationMembershipProcessing");

/**
 * Sends a scheduled report email based on organization settings.
 * @param {number} orgId - Organization ID
 * @param {string} reportType - Type of report (annualReport, semesterlyReport, statusReport)
 */
async function sendReportEmail(orgId, reportType) {
  try {
    // fetch organization settings
    const settings = getOrganizationEmailSettingsInDB(orgId);

    if (!settings || !settings[reportType]) {
      console.log(`Skipping ${reportType} for org ${orgId}, not enabled.`);
      return;
    }

    // fetch organization details
    const org = getSpecificOrgDataInDB(orgId);

    const orgAbr = org.org_abbreviation || org.organization_name;

    if (reportType === "statusReport") {
      // send individual status reports to members
      const currentSemester = getCurrentSemester();

      const members = getAllMembershipsInOrganizationInDB(
        orgId,
        currentSemester.semesterId
      );

      for (const membership of members) {
        const member = membership.member;
        if (!member) continue;

        // fetch attendance details
        const totalMeetings = await Attendance.count({
          where: { member_id: member.member_id, attendance_status: 1 }, // 1 = attended
        });

        const totalVolunteerEvents = await Attendance.count({
          where: { member_id: member.member_id, attendance_status: 2 }, // 2 = volunteer
        });

        const totalEvents = await Attendance.count({
          where: { member_id: member.member_id, attendance_status: 3 }, // 3 = social event
        });

        const isActive = membership.active_member;
        const numPointsAway = isActive
          ? null
          : Math.max(0, 48 - membership.member_points); // example threshold: 48
        const percent = isActive
          ? 100
          : Math.round((membership.member_points / 48) * 100);

        // generate email content
        const emailData = statusReportEmail(
          orgAbr,
          member.member_name,
          totalMeetings,
          totalVolunteerEvents,
          totalEvents,
          isActive,
          numPointsAway,
          percent
        );

        // send email
        await sendEmail(
          org.organization_email,
          member.member_email,
          emailData.subject,
          emailData.body
        );
      }
    } else {
      // handle semesterly and annual reports
      const totalMembers = await Membership.count({
        where: { organization_id: orgId },
      });
      const activeMembers = await Membership.count({
        where: { organization_id: orgId, active_member: true },
      });

      // mocking event statistics (Replace with DB queries)
      const meetingNum = Math.floor(Math.random() * 15) + 5;
      const eventNum = Math.floor(Math.random() * 10) + 3;
      const volunteerNum = Math.floor(Math.random() * 8) + 2;

      let emailData;
      if (reportType === "annualReport") {
        emailData = annualReportEmail(
          orgAbr,
          meetingNum,
          eventNum,
          volunteerNum,
          activeMembers,
          totalMembers
        );
      } else if (reportType === "semesterlyReport") {
        emailData = semesterReportEmail(
          orgAbr,
          meetingNum,
          eventNum,
          volunteerNum,
          activeMembers,
          totalMembers
        );
      }

      // Fetch recipients (admin emails) - Replace with DB query
      const recipients = [" "]; // update with real emails

      for (const email of recipients) {
        await sendEmail(
          org.organization_email,
          email,
          emailData.subject,
          emailData.body
        );
      }

      console.log(`${reportType} sent for ${orgAbr}.`);
    }
  } catch (err) {
    console.error(`Error sending ${reportType} for org ${orgId}:`, err);
  }
}

// schedule report emails examples
// schedule.scheduleJob("0 9 * * MON", () => sendReportEmail(1, "statusReport")); // Weekly for status reports
// schedule.scheduleJob("0 10 1 * *", () => sendReportEmail(1, "semesterlyReport")); // Monthly
// schedule.scheduleJob("0 12 1 1 *", () => sendReportEmail(1, "annualReport")); // Yearly

/**
 * Notify a member when they achieve active membership status.
 * @param {Object} member - The member object.
 * @param {Object} organization - The organization object.
 * @param {boolean} wasPreviouslyInactive - Whether the member was inactive before this update.
 */
async function sendActiveMembershipEmail(member, organization) {
  try {
    // Get email settings for the organization
    const emailSettings = await getOrganizationEmailSettingsInDB(
      organization.organization_id
    );

    if (!emailSettings.data || !emailSettings.data.membership_achieved) {
      console.log(
        `Email notifications for active membership are disabled for ${organization.organization_name}.`
      );
      return;
    }

    // Prepare the email content
    const emailContent = activeMembershipEmail(
      member.member_name,
      organization.organization_name,
      organization.organization_abbreviation
    );

    // Send the email
    await sendEmail(
      organization.organization_email,
      member.member_email,
      emailContent.subject,
      emailContent.body
    );
  } catch (error) {
    console.error("Error in sendActiveMembershipEmail:", error);
  }
}

module.exports = {
  sendReportEmail,
  sendActiveMembershipEmail,
};
