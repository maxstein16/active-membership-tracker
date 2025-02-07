const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();

class BusinessLogic {
    async processCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];

            // Read the CSV file and parse it
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true, skipEmptyLines: true }))  // Parse CSV file
                .on("data", (row) => {
                    // Handle empty or missing data in specific columns
                    const processedRow = {
                        firstName: row["First Name"] || "N/A",
                        lastName: row["Last Name"] || "N/A",
                        email: row["Email"] || "N/A",
                        accountType: row["Account Type"] || "Unknown",
                        degree: row["Degree"] || "N/A",
                        rsvp: row["RSVP'ed"] || "No",
                        officersNotes: row["Officer's Notes"] || "N/A",
                        attendeeRating: row["Attendee's Rating"] || "N/A",
                    };

                    results.push(processedRow);  // Add row to results
                })
                .on("end", async () => {
                    try {
                        // Clean up the uploaded file after processing
                        await fs.promises.unlink(filePath);

                        resolve({ data: results });
                    } catch (err) {
                        // Return error if file cleanup fails
                        reject({ error: error.fileCleanupFailed, details: err });
                    }
                })
                .on("error", (err) => {
                    // Return a structured error with the error message from `errors.js`
                    reject({ error: error.csvProcessingFailed, details: err });
                });
        });
    }
}

module.exports = BusinessLogic;
