const { getMemberByUsername } = require("../../data-layer/member");
const { getCurrentSemester } = require("../../data-layer/semester");
const { ROLE_EBOARD, ROLE_MEMBER } = require("../../../constants");

/**
 * HOW TO USE:
 * req.session.user.username needs to be passed into these functions
 */
module.exports = new (function () {
  this.isEboardOrAdmin = (username, orgId) => {
    checkRole(username, orgId, true);
  };

  this.isAdmin = (username, orgId) => {
    checkRole(username, orgId, false);
  };

  checkRole = async (username, orgId, allowEboard) => {
    // Get member info
    const memberResult = await getMemberByUsername(username);

    if (!memberResult) {
      return false; // No member found
    }

    const memberId = memberResult.member_id;

    // Get current semester
    const currentSemester = await getCurrentSemester();
    if (!currentSemester) return false;

    // Get membership
    const membership = await getMembershipByAttributes({
      member_id: memberId,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    if (!membership || membership.membership_role === ROLE_MEMBER) {
      return false;
    }

    // If only admin is allowed
    if (!allowEboard && membership.membership_role === ROLE_EBOARD) {
      return false;
    }

    return true;
  };
})();
