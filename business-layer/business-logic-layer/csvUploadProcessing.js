const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../business-logic-layer/public/errors.js");
const error = new ErrorMessages();
const {
  getMembersByAttributes,
  createMember,
} = require("../data-layer/member.js");
const { getEventById } = require("../data-layer/event.js");
const { getCurrentSemester } = require("../data-layer/semester.js");
const {
  createMembership,
  getMembershipByAttributes,
} = require("../data-layer/membership.js");
const { processAttendance } = require("./attendanceProcessing.js");
const { getAttendanceByMemberAndEvent } = require("../data-layer/attendance.js");

/**
 * Maps CSV row data to member data format
 * @param {Object} row Raw CSV row data
 * @returns {Object} Formatted member data
 */
function mapToMemberData(name, email) {
  return {
    member_name: name,
    member_email: email
  };
}

/**
 * Maps member, organization, and semester IDs to membership data format.
 * 
 * @param {number} memberId - The ID of the member.
 * @param {number} organizationId - The ID of the organization.
 * @param {number} semesterId - The ID of the semester.
 * @returns {Object} Formatted membership data object
 */
function mapToMembershipData(memberId, organizationId, semesterId) {
  return {
    member_id: memberId,
    organization_id: organizationId,
    semester_id: semesterId,
  };
}

/**
 * Maps event and member IDs to attendance data format.
 * 
 * @param {number} eventId - The ID of the event.
 * @param {number} memberId - The ID of the member.
 * @returns {Object} Formatted attendance data object
 */
function mapToAttendanceData(eventId, memberId) {
  return {
    event_id: eventId,
    member_id: memberId,
  };
}

/**
 * Process a CSV file and handle attendance for an event
 * @param {string} filePath Path to the CSV file
 * @param {number} eventId Event ID for attendance records
 * @param {number} orgId Organization ID
 * @returns {Promise<Object>} Processing results
 */

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

              // step 0
              //getting semester
              const currentSemester = await getCurrentSemester();
              if (!currentSemester) {
                console.log("current semester already exists")
              }

              // step 1
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

              //step 2 membership
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

              // step 3 attendance
              // Record the attendance
              console.log("Okay, now we check attendance")
              const existingAttendance = getAttendanceByMemberAndEvent(member.member_id, eventId);

              let attendanceData = null; // Initialize membershipData
              ß
              if (!existingAttendance || existingAttendance.length === 0) {
                console.log("No attendance exists");
                attendanceData = mapToAttendanceData(eventId, memberId);
                await processAttendance(attendanceData, eventType, orgId);
              } else {
                console.log("found attendance, u good");
              }


              results.push({ member, membershipData, attendanceData });
            }//foreach row

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
