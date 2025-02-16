const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();
const { createMemberInDB, getMembersByAttributes } = require("memberProcessing.js");
//TODO
const { addMemberAttendance } = require("attendanceProcessing.js");

class BusinessLogic {
    async processCSV(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            const processedEmails = new Set(); // Set to track already processed emails
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

                        // Check for duplicate email (if email has already been processed)
                        if (processedEmails.has(processedRow.email)) {
                            console.log(`Duplicate found for email: ${processedRow.email}. Skipping this row.`);
                            return resolve(); // Skip this row and move to the next
                        }

                        // Mark the email as processed
                        processedEmails.add(processedRow.email);

                        try {
                            // Check if the member exists in the member table
                            const existingMember = await getMembersByAttributes({ email: processedRow.email });

                            // If the member exists, just add them to attendance
                            if (existingMember.length > 0) {
                                console.log(`Email already exists: ${processedRow.email}. No need to add to Member table, adding to attendance.`);
                                //will require event id etc
                                const memberAddedToAttendanceResponse = await addMemberAttendance(processedRow);
                                if (memberAddedToAttendanceResponse.error) {
                                    console.error("Error adding member to attendance:", memberAddedToAttendanceResponse.error);
                                } else {
                                    console.log("Member added to attendance successfully.");
                                }
                            } else {
                                // If the member does not exist, add them to the member table
                                console.log(`Email does not exist: ${processedRow.email}. Adding to member table and attendance table.`);
                                const memberCreationResponse = await createMemberInDB(processedRow);
                                if (memberCreationResponse.error) {
                                    console.error("Error creating member: ", memberCreationResponse.error);
                                } else {
                                    console.log("Member created successfully:", memberCreationResponse.data);
                                }

                                // Add the newly created member to the attendance table
                                //will require event id etc
                                const memberAddedToAttendanceResponse = await addMemberAttendance(processedRow);
                                if (memberAddedToAttendanceResponse.error) {
                                    console.error("Error adding new member to attendance:", memberAddedToAttendanceResponse.error);
                                } else {
                                    console.log("New member added to attendance successfully.");
                                }
                            }

                            // Add row to results for reference or further processing
                            results.push(processedRow);

                        } catch (err) {
                            console.error(error.emailExistenceCheckError, err);
                        }

                        resolve(); // Resolve the promise for this row processing
                    }));
                })
                .on("end", async () => {
                    try {
                        await Promise.all(promises); // Wait for all rows to be processed
                        await fs.promises.unlink(filePath); // Clean up the uploaded file
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
