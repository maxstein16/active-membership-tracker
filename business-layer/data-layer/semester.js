const { Semester } = require("../db");

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
    const currentSemesters = await getCurrentSemesters();

    if (!currentSemesters || currentSemesters.length === 0) {
      throw new Error("No current semesters found");
    }

    // If multiple semesters are active, return the one with the latest start_date
    return currentSemesters.sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    )[0];
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
  getCurrentSemesters,
  getCurrentSemester,
  getSemestersByYear,
};
