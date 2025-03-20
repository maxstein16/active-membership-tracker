const {
    createSemester,
    getSemesterByDate,
    getCurrentSemester,
    getSemestersByYear,
  } = require("../data-layer/semester.js");
  const Error = require("./public/errors.js");
  const error = new Error();
  
  /**
   * Create a new semester in the database
   * @param {Object} semesterData - The semester data (name, academic year, start/end dates)
   * @returns {Promise<Object>} Object containing error and data properties
   */
  const createSemesterDB = async (semesterData) => {
    try {
      const { semester_name, academic_year, start_date, end_date } = semesterData;
      
      // Validate required fields
      if (!semester_name || !academic_year || !start_date || !end_date) {
        return { error: error.missingRequiredFields, data: null };
      }
      
      // Validate date range
      if (new Date(start_date) >= new Date(end_date)) {
        return { error: error.invalidDateRange, data: null };
      }
      
      // Create the semester
      const newSemester = await createSemester(
        semester_name,
        academic_year,
        start_date,
        end_date
      );
      
      return { error: error.noError, data: newSemester };
    } catch (err) {
      console.error("Error creating semester:", err);
      return { error: error.somethingWentWrong, data: null };
    }
  };
  
  /**
   * Get semester information based on a specific date
   * @param {Date|string} date - The date to find a semester for
   * @returns {Promise<Object>} Object containing error and data properties
   */
  const getSemesterByDateDB = async (date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Validate the date
      if (isNaN(dateObj.getTime())) {
        return { error: error.invalidDate, data: null };
      }
      
      const semester = await getSemesterByDate(dateObj);
      
      if (!semester) {
        return { error: error.semesterNotFound, data: null };
      }
      
      return { error: error.noError, data: semester };
    } catch (err) {
      console.error("Error fetching semester by date:", err);
      return { error: error.somethingWentWrong, data: null };
    }
  };
  
  /**
   * Get the current semester
   * @returns {Promise<Object>} Object containing error and data properties
   */
  const getCurrentSemesterDB = async () => {
    try {
      const semester = await getCurrentSemester();
      
      if (!semester) {
        return { error: error.semesterNotFound, data: null };
      }
      
      return { error: error.noError, data: semester };
    } catch (err) {
      console.error("Error fetching current semester:", err);
      return { error: error.somethingWentWrong, data: null };
    }
  };
  
  /**
   * Get semesters by academic year
   * @param {number|string} year - The academic year to filter by
   * @returns {Promise<Object>} Object containing error and data properties
   */
  const getSemestersByYearDB = async (year = new Date().getFullYear()) => {
    try {
      // Convert to number if string is provided
      const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
      
      // Validate the year
      if (isNaN(yearNum)) {
        return { error: error.invalidYear, data: null };
      }
      
      const semesters = await getSemestersByYear(yearNum);
      
      if (!semesters || semesters.length === 0) {
        return { error: error.noSemestersFound, data: [] };
      }
      
      return { error: error.noError, data: semesters };
    } catch (err) {
      console.error("Error fetching semesters by year:", err);
      return { error: error.somethingWentWrong, data: null };
    }
  };
  
  module.exports = {
    createSemesterDB,
    getSemesterByDateDB,
    getCurrentSemesterDB,
    getSemestersByYearDB,
  };