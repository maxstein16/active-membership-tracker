const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../../business-logic-layer/public/errors.js");
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
                    promises.push(new Promise(async (resolve) => {
                        try {
                            // Normalize row data
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

                            // Skip if email already processed
                            if (processedEmails.has(processedRow.email)) {
                                console.log(`Duplicate email found: ${processedRow.email}. Skipping.`);
                                return resolve();
                            }

                            processedEmails.add(processedRow.email);

                            // Check for existing member by email
                            const existingMemberResult = await getMembersByAttributes({
                                member_email: processedRow.email
                            });

                            let memberId;

                            // If member does not exist, create new member
                            if (existingMemberResult.error || !existingMemberResult.data?.length) {
                                const memberData = mapToMemberData(processedRow);
                                const createResult = await createMember(memberData);

                                if (createResult.error) {
                                    console.error("Error creating member:", createResult.error);
                                    return resolve();
                                }

                                memberId = createResult.data.member_id;
                            } else {
                                memberId = existingMemberResult.data[0].member_id;
                            }

                            // Check if the member already has a membership
                            const existingMembershipResult = await getMembershipsByAttributes(memberId, organizationId, semesterId);

                            // If no membership exists, create a new membership
                            if (existingMembershipResult.error || !existingMembershipResult.data?.length) {
                                const membershipData = mapToMembershipData(memberId, organizationId, semesterId);
                                const createMembershipResult = await createMembership(membershipData);

                                if (createMembershipResult.error) {
                                    console.error("Error creating membership:", createMembershipResult.error);
                                    return resolve();
                                }
                            }

                            // Now, record attendance
                            if (memberId && eventId) {
                                const attendanceData = mapToAttendanceData(processedRow, eventId, memberId);
                                const attendanceResult = await createAttendance(attendanceData);

                                if (attendanceResult.error) {
                                    console.error("Error creating attendance:", attendanceResult.error);
                                }
                            }

                            results.push({
                                ...processedRow,
                                member_id: memberId,
                                processed: true
                            });

                        } catch (err) {
                            console.error("Error processing row:", err);
                            results.push({
                                ...processedRow,
                                processed: false,
                                error: err.message
                            });
                        }

                        resolve();
                    }));
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
