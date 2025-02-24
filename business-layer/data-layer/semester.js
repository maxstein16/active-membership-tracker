const { Semester } = require('../db');

async function getCurrentSemesters() {
    const allSemesters = await Semester.findAll();
    const currentSemesters = allSemesters.filter((semester) => {
        let today = new Date();
        let endDate = new Date(semester.end_date);
        let startDate = new Date(semester.start_date);
        return startDate <= today && endDate >= today;
    });
    return currentSemesters;
}

async function getCurrentSemester() {
    try {
      const allSemesters = await Semester.findAll({
        order: [['semester_id', 'DESC']] // Get most recent semester first
      });
  
      if (!allSemesters || allSemesters.length === 0) {
        throw new Error("No semesters found");
      }
  
      const now = new Date();
      // Find the current semester where now is between start_date and end_date
      const currentSemester = allSemesters.find(semester => {
        const startDate = new Date(semester.start_date);
        const endDate = new Date(semester.end_date);
        return now >= startDate && now <= endDate;
      });
  
      return currentSemester || allSemesters[0]; // Return most recent if no current semester
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
      return allSemesters.filter(semester => {
        if (!semester.academic_year) return false;
        const [startYear, endYear] = semester.academic_year.split('-');
        return startYear === year.toString() || endYear === year.toString();
      });
    } catch (err) {
      console.error("Error in getSemestersByYear:", err);
      throw err;
    }
  }

module.exports = {
    getCurrentSemesters,
    getCurrentSemester,
    getSemestersByYear
};