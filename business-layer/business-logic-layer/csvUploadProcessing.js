const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();
const { createMemberInDB } = require("memberProcessing.js")

class BusinessLogic {


    async processCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];

            // Read the CSV file and parse it
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true, skipEmptyLines: true }))  // Parse CSV file
                .on("data", async (row) => {
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

                    // Before creating member, check if the email already exists (since it is a unique identifier apart form memberId which should be automatically set by the DB not manually)
                    try {
                        const existingMember = await getMembersByAttributes({ email: processedRow.email });
                        if (existingMember.length > 0) {
                            console.log(`Email already exists: ${processedRow.email}. Skipping this row.`);
                        } else {
                            // collection of all rows for more efficient insertion and debugging purposes
                            results.push(processedRow);  // Add row to results

                            // Call createMemberInDB for each processed row
                            const memberCreationResponse = await createMemberInDB(processedRow);
                            if (memberCreationResponse.error) {
                                console.error("Error creating member: ", memberCreationResponse.error);
                            } else {
                                console.log("Member created successfully:", memberCreationResponse.data);
                            }
                        }
                    } catch (err) {
                        console.error("Error checking email existence:", err);
                    }
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

}// BusinessLogic class end


module.exports = BusinessLogic;
