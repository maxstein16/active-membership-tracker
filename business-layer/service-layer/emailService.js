const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Send an email directly from the organization's email address
 * @param {string} from - Organization email address
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email content
 */
async function sendEmail(from, to, subject, body) {
  try {
    console.log(`Attempting to send email from: ${from} to: ${to}`);
    
    // Determine SMTP settings based on the email domain
    const domain = from.split('@')[1];
    let smtpConfig;
    
    // Configure SMTP settings based on the domain
    if (domain === 'rit.edu' || domain === 'g.rit.edu') {
      // RIT email settings
      smtpConfig = {
        host: 'smtp.office365.com',  // Office 365 SMTP server for RIT emails
        port: 587,
        secure: false,
        auth: {
          user: from,
          // Organization email password should be stored securely
          // This could be stored in a separate secure table in the database
          pass: process.env.ORG_EMAIL_PASSWORD || 'your_password_here'
        }
      };
    } else if (domain === 'gmail.com') {
      // Gmail settings
      smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: from,
          pass: process.env.ORG_EMAIL_PASSWORD || 'your_password_here'
        }
      };
    } else if (domain === 'outlook.com' || domain === 'hotmail.com') {
      // Outlook settings
      smtpConfig = {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: from,
          pass: process.env.ORG_EMAIL_PASSWORD || 'your_password_here'
        }
      };
    } else {
      // Generic SMTP settings
      smtpConfig = {
        host: `smtp.${domain}`,
        port: 587,
        secure: false,
        auth: {
          user: from,
          pass: process.env.ORG_EMAIL_PASSWORD || 'your_password_here'
        }
      };
    }
    
    // Create transporter with the determined settings
    const transporter = nodemailer.createTransport(smtpConfig);
    
    // Set up email options
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: body
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
  
    return false;
  }
}

module.exports = {
  sendEmail
};