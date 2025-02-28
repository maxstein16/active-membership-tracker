const { Member } = require("../../db");
const { createMemberInDB } = require("../memberProcessing");

/**
 * call ex: isNewUser.check("mep4741@rit.edu")
 * Checks to see if the user attached with the email given has their profile filled out or not
 * 
 * Return true -> user is new user, should be directed to edit profile
 * Return false -> user is experienced, should be redirected to dashboard
 */
module.exports = new (function () {
  this.check = (ritEmail, firstName, lastName) => {
    //get member with email and see what is filled
    const memberInfo = Member.findOne({
      where: { member_email: ritEmail },
    });

    if (!memberInfo) {
      createMemberInDB({
        member_name: `${firstName} ${lastName}`,
        member_email: ritEmail,
      });
      return true;
    }

    // check to see they filled in all the kinda required fields
    if (!memberInfo.member_phone_number || !memberInfo.member_major || !memberInfo.member_status || !memberInfo.member_tshirt_size ) {
        return true;
    }

    // they have all the basics filled in
    return false
  };
})();
