const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("./public/errors.js");
const error = new ErrorMessages();
const { createAttendance } = require("../data-layer/attendance.js");
const { getMembershipByAttributes, createMembership } = require("../data-layer/membership.js");
const { getMembersByAttributes, createMember, getMemberFromOrganization } = require("../data-layer/member.js");
const { configDotenv } = require("dotenv");

function mapToMemberData(row) {
    return {
        member_name: `${row["First Name"]?.trim() || null} ${row["Last Name"]?.trim() || null}`.trim(),
        member_email: row["Email"]?.trim().toLowerCase() || null,
        member_personal_email: row["Email"]?.trim().toLowerCase() || null,  // Using the same email for now
        member_major: row.degree,
        // Add other relevant mappings as needed
    };
}

function mapToMembershipData(memberId, organizationId, semesterId) {
    return {
        member_id: memberId,
        organization_id: organizationId,
        semester_id: semesterId
    };
}

function mapToAttendanceData(row, eventId, memberId) {
    // Check RSVP status (default to "no" if not provided)
    const rsvpStatus = row.rsvp ? row.rsvp.toLowerCase() : "no";

    // Set check-in to current timestamp if they attended (since they're in the CSV)
    const checkInTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    return {
        event_id: eventId,
        member_id: memberId,
        check_in: checkInTimestamp,  // Proper DATETIME format
        notes: row.officersNotes || null,
        rating: row.attendeeRating || null
    };
}



class CSVProcessor {
    async processCSV(filePath, eventId, organizationId, semesterId) {
        console.log("csvUploadProcessing is doing processCSV");
        console.log("Here is what is in parameters of the method " + filePath, eventId, organizationId, semesterId)

        return new Promise((resolve, reject) => {
            const csvRows = []; // Store all rows
            fs.createReadStream(filePath)
                .pipe(csv.parse({
                    headers: true,
                    skipEmptyLines: false,
                    trim: true
                }))
                .on("data", (row) => {
                    csvRows.push(row); // Store each row in the array
                    console.log("Row with info " + row + " just got stored/pushed in the array")
                })
                .on("end", async () => {
                    try {
                        const results = [];

                        for (const row of csvRows) {
                            const email = row["Email"]?.trim().toLowerCase() || "N/A";

                            // Check if member exists in the member table
                            console.log("HELLO!!!! CSV Upload Processing is trying to get member by email: " + email + " and organization ID: " + organizationId)
                            const memberResults = await getMembersByAttributes({ member_email: email });
                            console.log(memberResults);

                            if (memberResults.error) {
                                console.error("Error fetching member:", memberResults.error);
                                continue;
                            }

                            let member = null; // Initialize member

                            if (memberResults.data.length === 0) {
                                console.log("No member found, creating a new one...");
                                const memberData = mapToMemberData(row); // Map row to member data
                                member = await createMember(memberData); // Create the member
                            } else {
                                console.log("Member exists " + memberResults.data[0]);
                                member = memberResults.data[0];
                            }

                            // Check if the member has a membership for the organization
                            const existingMembership = await getMembershipByAttributes({ member_id: member.member_id, organization_id: organizationId });

                            let membershipData = null; // Initialize membershipData

                            if (!existingMembership || existingMembership.length === 0) {
                                console.log("No membership exists");
                                membershipData = mapToMembershipData(member.member_id, organizationId, semesterId);
                                await createMembership(membershipData); // Create the membership
                            } else {
                                console.log("csvUploadProcessing - Yippe! Found membership, now we track attendance");
                            }

                            // Record the attendance
                            //TODO EVENT ID IS HARDCODED FOR NOW
                            console.log("Okay, now we add them to attendance")
                            const attendanceData = mapToAttendanceData(row, eventId, member.member_id);
                            await createAttendance(attendanceData); // Create attendance record

                            results.push({ member, membershipData, attendanceData });
                        }

                        resolve(results); // Resolve the promise with results after processing all csvRows
                    } catch (err) {
                        console.error("Error processing CSV:", err);
                        reject(err); // Reject the promise if an error occurs
                    }
                });
        });
    }
}

module.exports = CSVProcessor;
