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

/**
 * Maps CSV row data to member data format
 * @param {Object} row Raw CSV row data
 * @returns {Object} Formatted member data
 */
function mapToMemberData(row) {
  return {
    member_name: `${row.firstName} ${row.lastName}`.trim(),
    member_email: row.email,
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
  async processCSV(filePath, eventId, orgId) {
    return new Promise((resolve, reject) => {
      const results = [];
      const promises = [];

      fs.createReadStream(filePath)
        .pipe(
          csv.parse({
            headers: true,
            skipEmptyLines: true,
            trim: true,
          })
        )
        .on("data", async (row) => {
          promises.push(
            new Promise(async (resolve) => {
              let member, membership, attendance;

              try {
                // Step 1: Get the current semester
                const currentSemester = await getCurrentSemester();
                if (!currentSemester) {
                  console.error("No active semester found.");
                  return resolve();
                }

                // Step 2: Get event details
                const event = await getEventById(eventId, orgId);
                if (!event) {
                  console.error(`Event not found for eventId: ${eventId}`);
                  return resolve();
                }
                const eventType = event.event_type;

                const email = row["Email"];

                // Step 3: Check for existing member
                const existingMemberResult = await getMembersByAttributes({
                  member_email: email,
                });

                if (
                  !existingMemberResult ||
                  existingMemberResult.length === 0
                ) {
                  // Create new member
                  const newMemberData = mapToMemberData(row);
                  const newMember = await createMember(newMemberData);
                  member = newMember;
                } else {
                  member = existingMemberResult[0];
                }

                // Step 4: Check for existing membership
                let existingMembership = await getMembershipByAttributes({
                  member_id: member.member_id,
                  organization_id: orgId,
                  semester_id: currentSemester.semester_id,
                });

                if (!existingMembership) {
                  const newMembershipData = mapToMembershipData(
                    member.member_id,
                    orgId,
                    currentSemester.semester_id
                  );
                  existingMembership = await createMembership(
                    newMembershipData
                  );
                }

                membership = existingMembership;

                // Step 5: Create attendance + process points/bonus/active checks
                const attendanceData = mapToAttendanceData(eventId, member.member_id);
                attendance = await processAttendance(
                  attendanceData,
                  eventType,
                  orgId
                );

                results.push({
                  member: member,
                  membership: membership,
                  attendance: attendance,
                  processed: true,
                });
              } catch (err) {
                console.error("Error processing row:", err);
                results.push({
                  row,
                  member: member,
                  membership: membership,
                  attendance: attendance,
                  processed: false,
                  error: err.message,
                });
              }
              resolve();
            })
          );
        })
        .on("end", async () => {
          try {
            await Promise.all(promises);
            await fs.promises.unlink(filePath);

            resolve({
              error: error.noError,
              data: {
                total: results.length,
                processed: results.filter((r) => r.processed).length,
                failed: results.filter((r) => !r.processed).length,
                details: results,
              },
            });
          } catch (err) {
            reject({
              error: error.fileCleanupFailed,
              details: err,
            });
          }
        })
        .on("error", (err) => {
          reject({
            error: error.csvProcessingFailed,
            details: err,
          });
        });
    });
  }
}

module.exports = CSVProcessor;
