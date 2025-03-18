const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
  },
});

/**
 * Send an email
 * @param {string} from - Organization email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email content
 */
async function sendEmail(from, to, subject, body) {
  const mailOptions = {
    from,
    to,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendEmail,
};
