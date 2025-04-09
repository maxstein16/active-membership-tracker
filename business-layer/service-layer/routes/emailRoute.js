const express = require('express');
const router = express.Router();
const { testMemberPointsCheck, scheduleMemberPointsCheck } = require('../../data-layer/email-settings');
const { sendReportEmail } = require('../../business-logic-layer/scheduleEmailProcessing');
const { getCurrentSemester } = require('../../data-layer/semester');

/**
 * GET /test/:orgId
 * Test email functionality for a specific organization
 */
router.get('/test/:orgId', async (req, res) => {
  try {
    const orgId = parseInt(req.params.orgId);
    
    // Validate orgId
    if (isNaN(orgId)) {
      return res.status(400).json({ error: 'Invalid organization ID' });
    }
    
    // Get current semester
    const currentSemester = await getCurrentSemester();
    if (!currentSemester) {
      return res.status(404).json({ error: 'No current semester found' });
    }
    
    // Run the test
    await testMemberPointsCheck(orgId, currentSemester.semester_id);
    
    return res.json({ 
      message: 'Email test completed', 
      organization: orgId,
      semester: currentSemester.semester_name
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return res.status(500).json({ error: 'An error occurred during testing' });
  }
});

/**
 * POST /email/send-report/:orgId
 * Send a specific report type
 */
router.post('/send-report/:orgId', async (req, res) => {
  try {
    const orgId = parseInt(req.params.orgId);
    const { reportType } = req.body;
    
    // Validate input
    if (isNaN(orgId)) {
      return res.status(400).json({ error: 'Invalid organization ID' });
    }
    
    if (!reportType || !['statusReport', 'semesterlyReport', 'annualReport'].includes(reportType)) {
      return res.status(400).json({ error: 'Invalid report type' });
    }
    
    // Send the report
    await sendReportEmail(orgId, reportType);
    
    return res.json({ 
      message: `${reportType} sent successfully`, 
      organization: orgId
    });
  } catch (error) {
    console.error('Error sending report:', error);
    return res.status(500).json({ error: 'An error occurred while sending the report' });
  }
});

/**
 * POST /email/schedule/:orgId
 * Schedule emails for an organization
 */
router.post('/schedule/:orgId', async (req, res) => {
  try {
    const orgId = parseInt(req.params.orgId);
    
    // Validate orgId
    if (isNaN(orgId)) {
      return res.status(400).json({ error: 'Invalid organization ID' });
    }
    
    // Get current semester
    const currentSemester = await getCurrentSemester();
    if (!currentSemester) {
      return res.status(404).json({ error: 'No current semester found' });
    }
    
    // Schedule emails
    scheduleMemberPointsCheck(orgId, currentSemester.semester_id, '0 9 * * MON'); // Every Monday at 9am
    
    // Schedule other reports (using existing functions from emailReportSystem)
    // These schedules are set up in the app startup, not here
    
    return res.json({ 
      message: 'Email schedules set up successfully', 
      organization: orgId,
      semester: currentSemester.semester_name
    });
  } catch (error) {
    console.error('Error setting up schedules:', error);
    return res.status(500).json({ error: 'An error occurred while setting up schedules' });
  }
});

module.exports = router;