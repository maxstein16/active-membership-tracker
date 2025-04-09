const { getMemberByUsername } = require("../../data-layer/member");
const { getCurrentSemester } = require("../../data-layer/semester");
const { ROLE_EBOARD, ROLE_MEMBER } = require("../../constants");
const { getMembershipByAttributes } = require("../../data-layer/membership");

async function checkRole(username, orgId, allowEboard) {
  try {

    console.log('username: ', username, ', org id: ', orgId, ", allowEboard: ", allowEboard);
    const memberResult = await getMemberByUsername(username);
    console.log('member result', memberResult)
    if (!memberResult) return false;

    console.log('member id', memberResult.member_id)
    const memberId = memberResult.member_id;
    const currentSemester = await getCurrentSemester();
    console.log('current semester, ', currentSemester)
    console.log('current semester id ', currentSemester.semester_id)
    if (!currentSemester) return false;

    const membership = await getMembershipByAttributes({
      member_id: memberId,
      organization_id: orgId,
      semester_id: currentSemester.semester_id,
    });

    console.log("mem", membership);

    if (!membership || membership.membership_role === ROLE_MEMBER) return false;
    if (!allowEboard && membership.membership_role === ROLE_EBOARD)
      return false;

    return true;
  } catch (err) {
    console.error("Error checking role:", err);
    return false;
  }
}

async function isEboardOrAdmin(username, orgId) {
  return checkRole(username, orgId, true);
}

async function isAdmin(username, orgId) {
  return checkRole(username, orgId, false);
}

module.exports = {
  isEboardOrAdmin,
  isAdmin,
};
