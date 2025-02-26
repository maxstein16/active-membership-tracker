const { Membership, Member } = require("../../db");
const { ROLE_EBOARD, ROLE_MEMBER } = require("../constants");

/**
 * HOW TO USE:
 * req.session.user.username needs to be passed into these functions
 */
module.exports = new (function () {
  this.isEboardOrAdmin = (username, orgId) => {
    checkRole(username, orgId, true)
  };

  this.isAdmin = (username, orgId) => {
    checkRole(username, orgId, false)
  };

  checkRole = (username, orgId, isEboardEnough) => {
    // find the member info to get member id
    const memberInfo = Member.findOne({
      where: { member_email: username },
    });

    // if none exists, they do not have privileges
    if (!memberInfo) {
      return false;
    }

    const membership = Membership.findOne({
      where: { organization_id: orgId, member_id: memberInfo.member_id },
    });

    if (
      !membership ||
      membership.membership_role == ROLE_MEMBER ||
      (!isEboardEnough && membership.membership_role == ROLE_EBOARD)
    ) {
      return false;
    }

    return true;
  };
})();
