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

module.exports = {
    getCurrentSemesters
};