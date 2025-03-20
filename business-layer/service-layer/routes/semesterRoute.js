const express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware.js");
const sanitizer = new Sanitizer();

/**
 * SEMESTER TABLE ATTRIBUTES (Based on DB):
 * - semester_id
 * - semester_name
 * - academic_year
 * - start_date
 * - end_date
 */

// GET /semester (Get all semesters for current year)
router.get("/", isAuthorizedHasSessionForAPI, async (req, res) => {
    const year = new Date().getFullYear();
    
    const semesters = await business.getSemestersByYear(year);
    if (semesters.error && semesters.error !== error.noError) {
        return res.status(404).json({ error: semesters.error });
    }
    
    return res.status(200).json({ status: "success", data: semesters.data });
});

// GET /semester/current (Get current semester)
router.get("/current", isAuthorizedHasSessionForAPI, async (req, res) => {
    const semester = await business.getCurrentSemester();
    if (semester.error && semester.error !== error.noError) {
        return res.status(404).json({ error: semester.error });
    }
    
    return res.status(200).json({ status: "success", data: semester.data });
});

// GET /semester/year/:year (Get semesters by year)
router.get("/year/:year", isAuthorizedHasSessionForAPI, async (req, res) => {
    let { year } = req.params;
    year = sanitizer.sanitize(year);
    
    if (isNaN(year)) {
        return res.status(400).json({ error: error.invalidYear });
    }
    
    const semesters = await business.getSemestersByYear(parseInt(year, 10));
    if (semesters.error && semesters.error !== error.noError) {
        return res.status(404).json({ error: semesters.error, year });
    }
    
    return res.status(200).json({ status: "success", data: semesters.data });
});

// GET /semester/date/:date (Get semester by date)
router.get("/date/:date", isAuthorizedHasSessionForAPI, async (req, res) => {
    let { date } = req.params;
    date = sanitizer.sanitize(date);
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: error.invalidDate });
    }
    
    const semester = await business.getSemesterByDate(dateObj);
    if (semester.error && semester.error !== error.noError) {
        return res.status(404).json({ error: semester.error, date });
    }
    
    return res.status(200).json({ status: "success", data: semester.data });
});

// POST /semester (Create a new semester)
router.post("/", isAuthorizedHasSessionForAPI, async (req, res) => {
    const { semester_name, academic_year, start_date, end_date } = req.body;
    
    // Sanitize inputs
    const sanitizedName = sanitizer.sanitize(semester_name);
    const sanitizedYear = sanitizer.sanitize(academic_year);
    const sanitizedStartDate = sanitizer.sanitize(start_date);
    const sanitizedEndDate = sanitizer.sanitize(end_date);
    
    // Validate required fields
    if (!sanitizedName || !sanitizedYear) {
        return res.status(400).json({ error: error.missingRequiredFields });
    }
    
    // Validate dates
    const startDateObj = new Date(sanitizedStartDate);
    const endDateObj = new Date(sanitizedEndDate);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return res.status(400).json({ error: error.invalidDate });
    }
    
    if (startDateObj >= endDateObj) {
        return res.status(400).json({ error: error.invalidDateRange });
    }
    
    // Prepare semester data
    const semesterData = {
        semester_name: sanitizedName,
        academic_year: sanitizedYear,
        start_date: startDateObj,
        end_date: endDateObj
    };
    
    // Create semester
    const semesterResult = await business.createSemester(semesterData);
    if (semesterResult.error && semesterResult.error !== error.noError) {
        return res.status(500).json({ error: semesterResult.error });
    }
    
    return res.status(201).json({ 
        status: "success", 
        message: "Semester created successfully", 
        data: semesterResult.data 
    });
});

module.exports = router;