const fs = require("fs");
const csv = require("fast-csv");
const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();

const { createMemberInDB } = require("./memberProcessing");
const { getMembersByAttributes } = require("../data-layer/member.js");
const { getEventById } = require("../data-layer/event.js");
const { getCurrentSemester } = require("../data-layer/semester.js");
const {
  createMembership,
  getMembershipByAttributes,
} = require("../data-layer/membership.js");
const {
  createAttendance,
  getMemberAttendanceWithEvents,
} = require("../data-layer/attendance.js");
const {
  getOrganizationById,
  getOrganizationMembershipRequirements,
  getBonusRequirements,
} = require("../data-layer/organization.js");
const {
  checkActiveMembership,
} = require("./organizationMembershipProcessing.js");
const {
  editMemberInOrganizationInDB,
} = require("./organizationMemberProcessing.js");

/**
 * Maps CSV row data to member data format
 * @param {Object} row Raw CSV row data
 * @returns {Object} Formatted member data
 */
function mapToMemberData(row) {
  return {
    name: `${row.firstName} ${row.lastName}`.trim(),
    email: row.email,
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
              try {
                // Get event details using eventId
                const event = await getEventById(eventId, orgId);
                if (!event) {
                  console.error(`Event not found for eventId: ${eventId}`);
                  return resolve();
                }
                const eventType = event.event_type;

                // Step 1: Get the current semester
                const currentSemester = await getCurrentSemester();
                if (!currentSemester) {
                  console.error("No active semester found.");
                  return resolve();
                }

                // Step 2: Check for existing member
                const existingMemberResult = await getMembersByAttributes({
                  member_email: email,
                });

                let memberId;

                if (
                  !existingMemberResult ||
                  existingMemberResult.length === 0
                ) {
                  // Member not found, create a new member
                  console.log(
                    `Member with email ${email} not found. Creating new member...`
                  );

                  const newMemberData = mapToMemberData(row);

                  try {
                    const newMember = await createMemberInDB(newMemberData);
                    memberId = newMember.member_id;
                    console.log(`New member created with ID: ${memberId}`);
                  } catch (error) {
                    console.error(`Error creating member: ${error.message}`);
                    return resolve(); // Skip processing for this row
                  }
                } else {
                  // Member already exists
                  memberId = existingMemberResult[0].member_id;
                }

                // Step 3: Check if the member has a membership for the current semester
                let membership = await getMembersByAttributes({
                  member_id: memberId,
                  organization_id: orgId,
                  semester_id: currentSemester.semester_id,
                });

                if (!membership) {
                  // Create new membership if none exists
                  membership = await createMembership({
                    member_id: memberId,
                    organization_id: orgId,
                    semester_id: currentSemester.semester_id,
                    membership_role: 0, // Default to member
                    membership_points: 0,
                    active_member: false,
                    received_bonus: [],
                  });

                  if (!membership) {
                    console.error("Failed to create membership.");
                    return resolve();
                  }
                }

                // Step 4: Record attendance
                const attendanceData = {
                  event_id: eventId,
                  member_id: memberId,
                };
                await createAttendance(attendanceData);

                // Step 5: Check if the organization is points-based
                const organization = await getOrganizationById(orgId);
                if (!organization) {
                  console.error("Organization not found.");
                  return resolve();
                }

                if (organization.organization_membership_type === "points") {
                  // Step 6: Fetch base points for this event type
                  const basePoints = await this.getBasePointsForEventType(
                    eventType,
                    orgId
                  );

                  // Step 7: Check for bonus eligibility
                  const bonusPoints = await this.calculateBonusPoints(
                    memberId,
                    orgId,
                    eventType,
                    membership.membership_id
                  );

                  // Step 8: Allocate total points
                  const totalPoints = basePoints + bonusPoints;

                  const memberDataToUpdate = { membership_points: totalPoints };

                  await editMemberInOrganizationInDB(
                    orgId,
                    memberId,
                    memberDataToUpdate
                  );
                } else {
                  // For attendance-based orgs, check active membership status
                  checkActiveMembership(memberId, organization.organization_id);
                }

                results.push({
                  email,
                  member_id: memberId,
                  processed: true,
                });
              } catch (err) {
                console.error("Error processing row:", err);
                results.push({
                  email: row["Email"],
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

  /**
   * Retrieves base points for an event type based on organization's membership requirements
   * @param {string} eventType - The type of event (e.g., 'General Meeting')
   * @param {number} orgId - Organization ID
   * @returns {Promise<number>} Base points for the event type
   */
  async getBasePointsForEventType(eventType, orgId) {
    const membershipRequirements = await getOrganizationMembershipRequirements(
      orgId
    );

    const matchingRequirement = membershipRequirements.find(
      (req) => req.event_type === eventType
    );

    return matchingRequirement ? matchingRequirement.requirement_value : 0;
  }

  /**
   * Calculates bonus points based on attendance percentage using BonusRequirement model
   * @param {number} memberId - Member ID
   * @param {number} orgId - Organization ID
   * @param {string} eventType - Type of event (e.g., "General Meeting")
   * @param {number} membershipId - The membership ID
   * @returns {Promise<number>} Bonus points earned
   */
  async calculateBonusPoints(memberId, orgId, eventType, membershipId) {
    // Get the membership record
    const membership = await getMembershipByAttributes({
      membership_id: membershipId,
    });
    if (!membership) return 0;

    // Get membership requirements for the organization
    const membershipRequirements = await getOrganizationMembershipRequirements(
      orgId
    );
    const requirement = membershipRequirements.find(
      (req) => req.event_type === eventType
    );

    if (!requirement) return 0;

    // Fetch all bonus thresholds
    const bonusRequirements = await getBonusRequirements(
      requirement.requirement_id
    );

    // Fetch attendance records for the member
    const attendanceRecords = await getMemberAttendanceWithEvents(
      memberId,
      orgId
    );

    // Filter attendance records to count only relevant event types
    const relevantAttendances = attendanceRecords.filter(
      (attendance) => attendance.Event.event_type === eventType
    );

    // Calculate attendance percentage
    const totalEvents = requirement.total_required; // Total events required for bonuses
    const attendedEvents = relevantAttendances.length;
    const attendancePercentage = (attendedEvents / totalEvents) * 100;

    // Get bonuses already received
    const alreadyReceivedBonuses = membership.received_bonus || [];

    // Determine applicable bonus
    let applicableBonus = bonusRequirements
      .filter(
        (bonus) =>
          attendancePercentage >= bonus.threshold_percentage &&
          !alreadyReceivedBonuses.includes(bonus.bonus_id) // Ensure it's not already received
      )
      .reduce((max, bonus) => Math.max(max, bonus.bonus_points), 0);

    if (applicableBonus > 0) {
      // Update membership points and mark the bonus as received
      membership.membership_points += applicableBonus;
      membership.received_bonus.push(
        bonusRequirements.find(
          (bonus) => bonus.bonus_points === applicableBonus
        ).bonus_id
      );

      await membership.save();
    }

    return applicableBonus;
  }
}

module.exports = CSVProcessor;
