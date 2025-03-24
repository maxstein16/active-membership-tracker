import { API_METHODS, getAPIData } from "./callAPI";

export async function getMemberInfoData(orgId, memberId) {
  // Fetch data from the API
  const memberData = await getAPIData(
    `/organization/${orgId}/member/${memberId}`,
    API_METHODS.get,
    {}
  );

  if (!memberData) {
    console.log("Must login", memberData);
    return { session: false };
  }

  if (!memberData || memberData.data == null) {
    return { error: true };
  }
  
  // === Preprocess remainingAttendance ===
  const cleanedRemainingAttendance = (
    memberData.data.remaining_attendance || []
  ).map((requirement) => ({
    ...requirement,
    attendancePercentage: requirement.attendancePercentage ?? 0,
    remainingPercentage: requirement.remainingPercentage ?? 0,
    totalEvents: requirement.totalEvents ?? 0,
  }));

  // Format the data
  const memberInfo = {
    id: memberData.data.member_id,
    name: memberData.data.member_name,
    email: memberData.data.member_email,
    personalEmail: memberData.data.member_personal_email,
    phoneNumber: memberData.data.member_phone_number || "N/A",
    graduationDate: memberData.data.member_graduation_date
      ? new Date(memberData.data.member_graduation_date).toLocaleDateString()
      : "N/A",
    tshirtSize: memberData.data.member_tshirt_size || "Unknown",
    major: memberData.data.member_major || "Unknown",
    gender: memberData.data.member_gender || "Unknown",
    race: memberData.data.member_race || "Unknown",
    status: memberData.data.member_status,
    activePercentage: memberData.data.active_percentage,
    remainingAttendance: cleanedRemainingAttendance,
    membership: {
      id: memberData.data.membership.membership_id,
      role: memberData.data.membership.membership_role,
      points: memberData.data.membership.membership_points,
      isActive: memberData.data.membership.active_member,
      receivedBonuses: memberData.data.membership.received_bonus || [],
    },
  };

  return memberInfo;
}

/**
 * Fetch organization information from the API and format it for use in the frontend.
 * @param {Number} orgId - Organization ID from the database
 * @returns Formatted organization data or an error/session object
 *
 * Format:
 * {
 *   id: Number,              // Organization ID
 *   name: String,            // Full name of the organization
 *   abbreviation: String,    // Abbreviation of the organization
 *   membershipType: String,  // Type of membership that the organization is based (points, attendance)
 *   threshold: Number,       // Points needed to reach active membership
 * }
 */
export async function getOrgInfoData(orgId) {
  // Fetch data from the API
  const orgData = await getAPIData(
    `/organization/${orgId}`,
    API_METHODS.get,
    {}
  );

  if (!orgData) {
    console.log("Must login", orgData);
    return { session: false };
  }

  if (!orgData || orgData.data == null) {
    return { error: true };
  }

  // Format the data
  const orgInfo = {
    id: orgData.data.organization_id,
    name: orgData.data.organization_name,
    abbreviation: orgData.data.organization_abbreviation,
    membershipType: orgData.data.organization_membership_type,
    threshold: orgData.data.organization_threshold,
  };

  return orgInfo;
}

/**
 * Save the membership to the database
 * @param {Number} orgId - organization id from the db
 * @param {Number} memberId - member id from the db
 * @param {String} membershipData - appropriate membershipData (membership_role, membership_points, active_member, received_bonus)
 * @returns true if no errors, false if error :(
 */
export async function updateMembershipData(orgId, memberId, membershipData) {
  console.log("Submitting to API:", membershipData);

  const result = await getAPIData(
    `/organization/${orgId}/member/${memberId}`,
    API_METHODS.put,
    membershipData
  );
  console.log("Result:" + result);

  if (!result) {
    return false;
  }
  if (result.status && result.status === "success") {
    return true;
  }
  return false;
}
