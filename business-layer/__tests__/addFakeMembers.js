/**
 * THIS FILE ADDS TEST DATA TO THE DB
 *
 * HOW TO RUN
 * cd ./active-membership-tracker/business-layer
 * node  ./__tests__/addFakeMembers.js
 *
 * WARNING TO FUTURE DEVELOPERS:
 * The members are real people with real RIT usernames.
 * We as the initial developers are using our own data to test.
 * If you run this on the production site, you will delete all our data....
 *
 */

const { ROLE_EBOARD, ROLE_MEMBER } = require("../../frontend-layer/src/utils/constants");
const {
    Member,
    Membership,
  } = require("../db");
  
  async function addFakeMembers() {  
    console.log("\n\nAdding test data to Database...");

  
    // MEMBERS
    console.log("3. Creating Test Members");
  
    const member1 = await Member.create({
      member_name: "Anoushka Shenoy",
      member_email: "anu9181@rit.edu",
      member_personal_email: "anu@gmail.com",
      member_graduation_date: "2025-05-10",
      member_tshirt_size: "S",
      member_major: "Web and Mobile Computing",
    });
  
    const member2 = await Member.create({
      member_name: "Karina Kageki-Bonnert",
      member_email: "kkb1912@rit.edu",
      member_personal_email: "kkb@gmail.com",
      member_graduation_date: "2025-05-10",
      member_tshirt_size: "S",
      member_major: "Web and Mobile Computing",
    });
  
    const member3 = await Member.create({
      member_name: "Riya Nigudkar",
      member_email: "rn2918@rit.edu",
      member_personal_email: "riya@gmail.com",
      member_graduation_date: "2025-05-10",
      member_tshirt_size: "S",
      member_major: "Web and Mobile Computing",
    });
  
    const member4 = await Member.create({
      member_name: "Phoebe Wong",
      member_email: "pw4291@rit.edu",
      member_personal_email: "phoebe@gmail.com",
      member_graduation_date: "2025-05-10",
      member_major: "Web and Mobile Computing",
    });
  
    // Memberships
    console.log("4. Creating Test Memberships");
  
    const members = [
      member1,
      member2,
      member3,
      member4
    ];
  
    for (const member of members) {
      let randomNum = Math.floor(Math.random() * 40) + 1;
      await Membership.create({
        membership_role: randomNum > 20 ? ROLE_EBOARD : ROLE_MEMBER,
        member_id: member.member_id,
        organization_id: org1.organization_id,
        semester_id: sem1.semester_id,
        membership_points: randomNum,
        active_member: randomNum >= 42,
        active_semesters: 1,
      });
  
      randomNum = Math.floor(Math.random() * 40) + 1;
      await Membership.create({
        membership_role: randomNum > 20 ? ROLE_EBOARD : ROLE_MEMBER,
        member_id: member.member_id,
        organization_id: org2.organization_id,
        semester_id: sem1.semester_id,
        membership_points: randomNum,
        active_member: randomNum >= 23,
        active_semesters: 1,
      });
    }
  
    // Finishing up
    console.log("\nFinishing up...");
    console.log("This may take a couple minutes...wait for the script to end");
  }
  
  (async () => {
    addFakeMembers();
  })();  