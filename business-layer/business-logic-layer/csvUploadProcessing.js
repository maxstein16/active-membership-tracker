const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("./public/errors.js");
const error = new ErrorMessages();
const { createAttendance } = require("../data-layer/attendance.js");
const { createMembership } = require("../data-layer/membership.js");
const { getMembersByAttributes, createMember } = require("../data-layer/member.js");

/**
 * Maps CSV row data to member data format
 * @param {Object} row Raw CSV row data
 * @returns {Object} Formatted member data
 */
function mapToMemberData(row) {
    return {
        member_name: `${row.firstName} ${row.lastName}`.trim(),
        member_email: row.email,
        member_personal_email: row.email,  // Using the same email for now
        member_major: row.degree,
        // Add other relevant mappings as needed
    };
}

/**
 * Maps CSV row data to membership data format
 * @param {number} memberId Member ID
 * @param {number} organizationId Organization ID
 * @param {string} semesterId Semester ID
 * @returns {Object} Formatted membership data
 */
function mapToMembershipData(memberId, organizationId, semesterId) {
    return {
        member_id: memberId,
        organization_id: organizationId,
        semester_id: semesterId
    };
}

/**
 * Maps CSV row data to attendance data format
 * @param {Object} row Raw CSV row data
 * @param {number} eventId Event ID
 * @param {number} memberId Member ID
 * @returns {Object} Formatted attendance data
 */
function mapToAttendanceData(row, eventId, memberId) {
    return {
        event_id: eventId,
        member_id: memberId,
        check_in: row.rsvp.toLowerCase() === "yes",
        notes: row.officersNotes,
        rating: row.attendeeRating
    };
}

class CSVProcessor {
    /**
     * Process a CSV file and handle member and attendance records
     * @param {string} filePath Path to the CSV file
     * @param {number} eventId Event ID for attendance records
     * @param {number} organizationId Organization ID
     * @param {string} semesterId Semester ID
     * @returns {Promise<Object>} Processing results
     */
    async processCSV(filePath, eventId, organizationId, semesterId) {

        console.log("csvUploadProcessing is doing processCSV")
        return new Promise((resolve, reject) => {
            const results = [];
            const processedEmails = new Set();
            const promises = [];

            // Reading from the file path
            fs.createReadStream(filePath)
                .pipe(csv.parse({
                    headers: true,
                    skipEmptyLines: false,
                    trim: true
                }))
                .on("data", async (row) => {
                    const promise = new Promise(async (resolve) => {
                        let processedRow = {};

                        try {
                            processedRow = {
                                firstName: row["First Name"]?.trim() || "N/A",
                                lastName: row["Last Name"]?.trim() || "N/A",
                                email: row["Email"]?.trim().toLowerCase() || "N/A", // Ensure lowercase + no whitespace issues
                                accountType: row["Account Type"]?.trim() || "Unknown",
                                degree: row["Degree"]?.trim() || "N/A",
                                rsvp: row["RSVP'ed"]?.trim() || "No",
                                officersNotes: row["Officer's Notes"]?.trim() || "N/A",
                                attendeeRating: row["Attendee's Rating"]?.trim() || "N/A",
                            };

                            // Skip duplicates
                            if (processedEmails.has(processedRow.email)) {
                                console.log(`Duplicate email found: ${processedRow.email}. Skipping.`);
                                return resolve();
                            }

                            processedEmails.add(processedRow.email);
                            console.log("Processed email is: " + processedRow.email);

                            console.log("Trying to find member by email attribute...");

                            // 🔹 Fetch member
                            const existingMemberResult = await getMembersByAttributes({
                                member_email: processedRow.email
                            });

                            // 🔹 Debugging: Log the entire response to verify structure
                            console.log("Existing Member Result:", JSON.stringify(existingMemberResult, null, 2));

                            let memberId = 0; // Default to 0 or null

                            // 🔹 Correctly check `data` array from the response
                            if (existingMemberResult?.error) {
                                console.error("Error while fetching member:", existingMemberResult.error);
                            } else if (existingMemberResult?.data?.length > 0) {
                                console.log("✅ Member found! ID:", existingMemberResult.data[0].member_id);
                                memberId = existingMemberResult.data[0].member_id;
                            } else {
                                console.log("❌ No member found with the given email:", processedRow.email);
                            }

                            // 🔹 Store results
                            results.push({
                                ...processedRow,
                                memberId: memberId,
                                processed: true
                            });

                        } catch (err) {
                            console.error("🚨 Error processing row:", err);
                            results.push({
                                ...processedRow,
                                processed: false,
                                error: err.message
                            });
                        }

                        resolve();
                    });

                    promises.push(promise);
                })
                .on("end", async () => {
                    try {
                        await Promise.all(promises);
                        await fs.promises.unlink(filePath);

                        resolve({
                            error: error.noError,
                            data: {
                                total: results.length,
                                processed: results.filter(r => r.processed).length,
                                failed: results.filter(r => !r.processed).length,
                                details: results
                            }
                        });
                    } catch (err) {
                        reject({
                            error: error.fileCleanupFailed,
                            details: err
                        });
                    }
                })
                .on("error", (err) => {
                    reject({
                        error: error.csvProcessingFailed,
                        details: err
                    });
                });
        });
    }
}

module.exports = CSVProcessor;
