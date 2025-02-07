const schedule = require("node-schedule");
const { getOrganizationSettings } = require("../business-logic-layer/organizationSettingsProcessing");
const { sendEmail } = require("../service-layer/emailService");

// function to send reports
async function sendReportEmail(orgId, reportType) {
  const settings = await getOrganizationSettings(orgId);
  
  if (settings.error || !settings.data[reportType]) {
    console.log(`Skipping ${reportType} for org ${orgId}, not enabled.`);
    return;
  }

  const recipients = [" "]; // Fetch from DB
  const subject = `${reportType} for Organization ${orgId}`;
  const body = `<p>Hello, here is the ${reportType}.</p>`;

  for (const email of recipients) {
    await sendEmail(email, subject, body);
  }
}

// Schedule reports examples
// schedule.scheduleJob("0 9 * * MON", () => sendReportEmail(1, "statusReport"));
// schedule.scheduleJob("0 10 1 * *", () => sendReportEmail(1, "semesterlyReport"));
// schedule.scheduleJob("0 12 1 1 *", () => sendReportEmail(1, "yearlyReport"));
