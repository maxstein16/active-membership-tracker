const { Op } = require("sequelize");
const { Semester } = require("../db");

/**
 * Creates a new semester.
 *
 * @param {string} semesterName - The name of the semester (e.g., "Spring 2025").
 * @param {string} academicYear - The academic year (e.g., "2025-2026").
 * @param {Date} startDate - The start date of the semester.
 * @param {Date} endDate - The end date of the semester.
 * @returns {Promise<Object>} The newly created semester.
 */
async function createSemester(semesterName, academicYear, startDate, endDate) {
  try {
    const newSemester = await Semester.create({
      semester_name: semesterName,
      academic_year: academicYear,
      start_date: startDate,
      end_date: endDate,
    });

    console.log(`New semester created: ${newSemester.semester_name}`);
    return newSemester;
  } catch (error) {
    console.error("Error creating semester:", error);
    throw error;
  }
}

/**
 * Finds a semester given a start date and end date.
 *
 * @param {Date} date - The date that should fall within the semester.
 * @returns {Promise<Object|null>} The matching semester or null if not found.
 */
async function getSemesterByDate(date) {
  try {
    const semester = await Semester.findOne({
      where: {
        start_date: { [Op.lte]: date },
        end_date: { [Op.gte]: date },
      },
    });

    return semester;
  } catch (error) {
    console.error("Error finding semester by date:", error);
    throw error;
  }
}

async function getCurrentSemester() {
  try {
/** Old code, pre-merge 1:02PM 3/20:
 * const currentSemesters = await getSemestersByYear();
 * if (!currentSemesters || currentSemesters.length === 0){
 * throw new Error("No current semesters found");
 * }
 * 
 * //if multiple semesters are active, return the one with the latest start_date
 * return currentSemesters.sort
 * (a,b)  => new Date(b.start_date) - new Date(a.start_date) ) [0];
 */

    const today = new Date();
    
    const currentSemester = await Semester.findOne({
      where: {
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      }
    });
    
    if (!currentSemester) {
      return null;
    }
    
    return currentSemester;
  } catch (err) {
    console.error("Error in getCurrentSemester:", err);
    throw err;
  }
}

async function getSemestersByYear(year = new Date().getFullYear()) {
  try {
    if (!year) return [];

    const allSemesters = await Semester.findAll();
    if (!allSemesters || allSemesters.length === 0) return [];

    // For a given year (e.g., 2024), match academic years like "2024-2025" or "2023-2024"
    return allSemesters.filter((semester) => {
      if (!semester.academic_year) return false;
      const [startYear, endYear] = semester.academic_year.split("-");
      return startYear === year.toString() || endYear === year.toString();
    });
  } catch (err) {
    console.error("Error in getSemestersByYear:", err);
    throw err;
  }
}

module.exports = {
  createSemester,
  getSemesterByDate,
  getCurrentSemester,
  getSemestersByYear,
};
