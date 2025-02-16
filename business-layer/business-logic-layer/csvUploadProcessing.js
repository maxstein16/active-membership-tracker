const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();
const { createMemberInDB, getMembersByAttributes } = require("memberProcessing.js");

class BusinessLogic {
    async processCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            const promises = [];

            // Read the CSV file and parse it
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true, skipEmptyLines: true }))  // Parse CSV file
                .on("data", async (row) => {
                    promises.push(new Promise(async (resolve, reject) => {
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

                        // Before creating member, check if the email already exists (since it is a unique identifier apart from memberId which should be automatically set by the DB)
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
                            console.error(error.emailExistenceCheckError, err);
                        }
                        resolve(); // Resolve the promise for this row processing
                    }));
                })
                .on("end", async () => {
                    try {
                        await Promise.all(promises); // Wait for all rows to be processed
                        await fs.promises.unlink(filePath);
                        resolve({ data: results });
                    } catch (err) {
                        const fileCleanupError = new Error(error.fileCleanupFailed);
                        fileCleanupError.details = err;
                        reject(fileCleanupError); // Reject with a proper Error object
                    }
                })
                .on("error", (err) => {
                    const csvProcessingError = new Error(error.csvProcessingFailed);
                    csvProcessingError.details = err;
                    reject(csvProcessingError); // Reject with a proper Error object
                });
        });
    }
}

module.exports = BusinessLogic;
