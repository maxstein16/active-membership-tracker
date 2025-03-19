import { API_METHODS, getAPIData } from "./callAPI";

/**
 * Fetch member information from the API and format it for use in the frontend.
 * @param {Number} orgId - Organization ID from the database
 * @param {Number} memberId - Member ID from the database
 * @returns Formatted member data or an error/session object
 *
 * Format:
 * {
 *   id: Number,              // Member ID
 *   name: String,            // Full name of the member
 *   email: String,           // Member's email
 *   personalEmail: String,   // Member's personal email
 *   phoneNumber: String,     // Contact number (if available)
 *   graduationDate: String,  // Formatted graduation date (MM/DD/YYYY) or "N/A"
 *   tshirtSize: String,      // T-shirt size (if available)
 *   major: String,           // Major field of study
 *   gender: String,          // Gender
 *   race: String,            // Race
 *   status: String,          // Membership status (undergraduate, graduate, etc.)
 *   activePercentage: Number,// Percentage to active membership
 *   membership: {
 *     id: Number,            // Membership ID
 *     role: Number,          // Membership role (0=Member, 1=E-Board, 2=Admin)
 *     roleName: String,      // Mapped role name ("Member", "E-Board", "Admin")
 *     points: Number,        // Membership points
 *     isActive: Boolean,     // Whether the member is active
 *     receivedBonuses: Array // List of received bonus IDs
 *   }
 * }
 */
export async function getMemberInfoData(orgId, memberId) {
  // Fetch data from the API
  const memberData = await getAPIData(
    `/organization/${orgId}/member/${memberId}`,
    API_METHODS.get,
    {}
  );

  console.log(memberData);
  

  if (!memberData) {
    console.log("Must login", memberData);
    return { session: false };
  }

  if (!memberData || memberData.data == null) {
    return { error: true };
  }

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

  console.log(orgData);

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
