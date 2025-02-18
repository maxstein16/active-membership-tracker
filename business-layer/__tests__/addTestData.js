/**
 * THIS FILE ADDS TEST DATA TO THE DB
 *
 * HOW TO RUN
 * cd ./active-membership-tracker/business-layer
 * node  ./__tests__/addTestData.js
 *
 * WARNING TO FUTURE DEVELOPERS:
 * The members are real people with real RIT usernames.
 * We as the initial developers are using our own data to test.
 * If you run this on the production site, you will delete all our data....
 */

const {
  Organization,
  Semester,
  Member,
  Membership,
  EmailSettings,
  MembershipRequirement,
} = require("../db");
const { deleteOldTestData } = require("./deleteOldTestData");

async function addTestData() {
  // Delete old test data
  console.log("Deleting old test data...");
  await deleteOldTestData();

  console.log("\n\nAdding test data to Database...");

  // ORGANIZATION
  console.log("\n1. Creating Test Organizations");
  const org1 = await Organization.create({
    organization_name: "WiC TEST ONLY",
    organization_description: "This is a test for WiC Settings",
    organization_color: "#381A58",
    org_abbreviation: "WiC TEST",
    organization_threshold: 42,
  });

  const org2 = await Organization.create({
    organization_name: "COMS TEST ONLY",
    organization_description: "This is a test for COMS Settings",
    organization_color: "#20BDE4",
    org_abbreviation: "COMS TEST",
    organization_threshold: 23,
  });

  // SEMESTERS
  console.log("2. Creating Test Semesters");

  const sem1 = await Semester.create({
    semester_id: 1123,
    semester_name: "2024 FALL TEST",
    academic_year: "2024-2025",
    start_date: "2024-08-14",
    end_date: "2024-12-16",
  });

  const sem2 = await Semester.create({
    semester_id: 1124,
    semester_name: "2025 SPRING TEST",
    academic_year: "2024-2025",
    start_date: "2025-01-14",
    end_date: "2024-05-02",
  });

  // MEMBERS
  console.log("3. Creating Test Members");

  const member1 = await Member.create({
    member_name: "Maija Philip",
    member_email: "mep4741@rit.edu",
    member_personal_email: "maija.philip@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "S",
    member_major: "Web and Mobile Computing",
    member_gender: "F",
    member_race: "White",
  });

  const member2 = await Member.create({
    member_name: "Max Stein",
    member_email: "mhs8558@rit.edu",
    member_personal_email: "max.stein@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "M",
    member_major: "Web and Mobile Computing",
    member_gender: "M",
    member_race: "White",
  });

  const member3 = await Member.create({
    member_name: "Divna Mijic",
    member_email: "dm9718@rit.edu",
    member_personal_email: "divna.mijic@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "S",
    member_major: "Web and Mobile Computing",
    member_gender: "F",
    member_race: "White",
  });

  const member4 = await Member.create({
    member_name: "Kasim O'Meally",
    member_email: "klo7619@rit.edu",
    member_personal_email: "kasim.omeally@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
  });

  const member5 = await Member.create({
    member_name: "Joseph Henry",
    member_email: "jdh6459@rit.edu",
    member_personal_email: "joseph.henry@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
  });

  const member6 = await Member.create({
    member_name: "Alexandria Eddings",
    member_email: "aze6809@rit.edu",
    member_personal_email: "alexandria.eddings@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
  });

  const member7 = await Member.create({
    member_name: "Gabriella Alvarez-Mcleod",
    member_email: "gma5228@rit.edu",
    member_personal_email: "Gabriella.alvarez-mcleod@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Human Computer Interaction",
  });

  // Memberships
  console.log("4. Creating Test Memberships");

  const members = [
    member1,
    member2,
    member3,
    member4,
    member5,
    member6,
    member7,
  ];

  for (const member of members) {
    let randomNum = Math.floor(Math.random() * 40) + 1;
    const membership1a = await Membership.create({
      membership_role: 2,
      member_id: member.member_id,
      organization_id: org1.organization_id,
      semester_id: sem1.semester_id,
      membership_points: randomNum,
      active_member: randomNum >= 42,
      active_semesters: 1,
    });

    randomNum = Math.floor(Math.random() * 40) + 1;
    const membership1b = await Membership.create({
      membership_role: 2,
      member_id: member.member_id,
      organization_id: org1.organization_id,
      semester_id: sem1.semester_id,
      membership_points: randomNum,
      active_member: randomNum >= 23,
      active_semesters: 1,
    });
  }

  // Email Settings
  console.log("5. Adding Email Settings");

  await EmailSettings.create({
    organization_id: org1.organization_id,
    current_status: true,
    annual_report: false,
    semester_report: true,
    membership_achieved: false,
  });

  await EmailSettings.create({
    organization_id: org2.organization_id,
    current_status: false,
    annual_report: false,
    semester_report: true,
    membership_achieved: true,
  });

  // Membership Requirements
  console.log("6. Adding Membership Requirements");

  await MembershipRequirement.create({
    organization_id: org1.organization_id,
    meeting_type: "Meeting",
    frequency: "Semesterly",
    amount_type: "points",
    amount: 4,
    requirement_scope: "semesterly",
  });

  await MembershipRequirement.create({
    organization_id: org1.organization_id,
    meeting_type: "Event",
    frequency: "Yearly",
    amount_type: "points",
    amount: 2,
    requirement_scope: "yearly",
  });

  await MembershipRequirement.create({
    organization_id: org1.organization_id,
    meeting_type: "Volunteer",
    frequency: "Semesterly",
    amount_type: "percentage",
    amount: 50,
    requirement_scope: "semesterly",
  });

  await MembershipRequirement.create({
    organization_id: org2.organization_id,
    meeting_type: "Meeting",
    frequency: "Yearly",
    amount_type: "points",
    amount: 1,
    requirement_scope: "yearly",
  });

  await MembershipRequirement.create({
    organization_id: org2.organization_id,
    meeting_type: "Event",
    frequency: "Semesterly",
    amount_type: "percentage",
    amount: 25,
    requirement_scope: "semesterly",
  });

  await MembershipRequirement.create({
    organization_id: org2.organization_id,
    meeting_type: "Volunteer",
    frequency: "Semesterly",
    amount_type: "percentage",
    amount: 50,
    requirement_scope: "semesterly",
  });

  // Events
  console.log("7. Adding Events");
  await Event.create({
    organization_id: org1.organization_id,
    event_name: "WiC General Meeting",
    event_start: "2025-02-05 18:00:00",
    event_end: "2025-02-05 19:30:00",
    event_location: "GOL 1400",
    event_description: "An overview of upcoming events and initiatives.",
    event_type: "general_meeting",
  });
  await Event.create({
    organization_id: org1.organization_id,
    event_name: "WiC Volunteer Day",
    event_start: "2025-03-10 10:00:00",
    event_end: "2025-03-10 14:00:00",
    event_location: "Local Community Center",
    event_description: "Helping out at the community center with tech workshops.",
    event_type: "volunteer",
  });

  await Event.create({
    organization_id: org1.organization_id,
    event_name: "WiC Social Night",
    event_start: "2025-04-15 19:00:00",
    event_end: "2025-04-15 22:00:00",
    event_location: "Java's Café",
    event_description: "A night of networking, games, and fun!",
    event_type: "social",
  },)
  await Event.create( {
    organization_id: org2.organization_id,
    event_name: "COMS Workshop: Resume Building",
    event_start: "2025-02-12 17:30:00",
    event_end: "2025-02-12 19:00:00",
    event_location: "GOL 2250",
    event_description: "Learn how to craft a compelling resume with industry professionals.",
    event_type: "workshop",
  },)
  await Event.create({
    organization_id: org2.organization_id,
    event_name: "COMS Charity Fundraiser",
    event_start: "2025-03-20 18:00:00",
    event_end: "2025-03-20 21:00:00",
    event_location: "RIT Ballroom",
    event_description: "A night of fundraising for a local cause with guest speakers.",
    event_type: "fundraiser",
  },)
  await Event.create({
    organization_id: org2.organization_id,
    event_name: "COMS Committee Brainstorming",
    event_start: "2025-04-10 16:00:00",
    event_end: "2025-04-10 18:00:00",
    event_location: "GOL 3000",
    event_description: "Collaborate and plan initiatives for the next semester.",
    event_type: "committee",
  })


  // Events
  console.log("8. Adding Attendance");

  // Finishing up
  console.log("\nFinishing up...");
  console.log("This may take a couple minutes...wait for the script to end");
}

(async () => {
  addTestData();
})();
