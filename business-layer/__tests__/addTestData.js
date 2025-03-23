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
 *
 * SEE WHAT DATA I ENTER:
 * I show the filled tables at the end of the file
 */

const {
  Organization,
  Semester,
  Member,
  Membership,
  EmailSettings,
  MembershipRequirement,
  BonusRequirement,
  Attendance,
  Event,
} = require("../db");
const { deleteOldTestData } = require("./deleteOldTestData");

async function addTestData() {
  // Delete old test data
  console.log("Deleting old test data...");
  await deleteOldTestData();

  console.log("\n\nAdding test data to Database...");

  const now = new Date();

  // ORGANIZATION
  console.log("\n1. Creating Test Organizations");
  const org1 = await Organization.create({
    organization_name: "WiC TEST ONLY",
    organization_description: "This is a test for WiC Settings",
    organization_color: "#381A58",
    organization_abbreviation: "WiC TEST",
    organization_email: "wic@rit.edu",
    organization_membership_type: "attendance",
    organization_threshold: 30,
  });

  const org2 = await Organization.create({
    organization_name: "COMS TEST ONLY",
    organization_description: "This is a test for COMS Settings",
    organization_color: "#20BDE4",
    organization_abbreviation: "COMS TEST",
    organization_email: "coms@rit.edu",
    organization_membership_type: "points",
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
    end_date: "2025-05-02",
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
    member_gender: "female",
    member_race: "white",
  });

  const member2 = await Member.create({
    member_name: "Max Stein",
    member_email: "mhs8558@rit.edu",
    member_personal_email: "max.stein@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "M",
    member_major: "Web and Mobile Computing",
    member_gender: "male",
    member_race: "white",
  });

  const member3 = await Member.create({
    member_name: "Divna Mijic",
    member_email: "dm9718@rit.edu",
    member_personal_email: "divna.mijic@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "S",
    member_major: "Web and Mobile Computing",
    member_gender: "female",
    member_race: "white",
  });

  const member4 = await Member.create({
    member_name: "Kasim O'Meally",
    member_email: "klo7619@rit.edu",
    member_personal_email: "kasim.omeally@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
    member_gender: "male",
    member_race: "black",
  });

  const member5 = await Member.create({
    member_name: "Joseph Henry",
    member_email: "jdh6459@rit.edu",
    member_personal_email: "joseph.henry@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
    member_gender: "male",
    member_race: "white",
  });

  const member6 = await Member.create({
    member_name: "Alexandria Eddings",
    member_email: "aze6809@rit.edu",
    member_personal_email: "alexandria.eddings@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
    member_gender: "female",
    member_race: "black",
  });

  const member7 = await Member.create({
    member_name: "Gabriella Alvarez-Mcleod",
    member_email: "gma5228@rit.edu",
    member_personal_email: "Gabriella.alvarez-mcleod@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Human Computer Interaction",
    member_gender: "non-binary",
    member_race: "hispanic",
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
    const allPossibleBonusIds = [1, 2, 3, 4, 5];
    const numBonuses = Math.floor(Math.random() * 4);
    const shuffled = allPossibleBonusIds.sort(() => 0.5 - Math.random());
    const selectedBonuses = shuffled.slice(0, numBonuses);

    // Membership for WiC
    await Membership.create({
      membership_role: 2,
      member_id: member.member_id,
      organization_id: org1.organization_id,
      semester_id: sem2.semester_id,
      membership_points: 0,
      active_member: false,
      received_bonus: [],
      active_semesters: 1,
    });

    // Membership for COMS
    const randomNum = Math.floor(Math.random() * 40) + 1;
    await Membership.create({
      membership_role: 2,
      member_id: member.member_id,
      organization_id: org2.organization_id,
      semester_id: sem2.semester_id,
      membership_points: randomNum,
      active_member: randomNum >= 23,
      received_bonus: selectedBonuses,
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
    event_type: "general_meeting",
    requirement_type: "attendance_count",
    requirement_value: 8,
  });

  await MembershipRequirement.create({
    organization_id: org1.organization_id,
    event_type: "social",
    requirement_type: "attendance_count",
    requirement_value: 3,
  });

  await MembershipRequirement.create({
    organization_id: org1.organization_id,
    event_type: "volunteer",
    requirement_type: "percentage",
    requirement_value: 60,
  });

  await MembershipRequirement.create({
    organization_id: org2.organization_id,
    event_type: "general_meeting",
    requirement_type: "points",
    requirement_value: 10,
  });

  await BonusRequirement.create({
    requirement_id: 4,
    threshold_percentage: 25,
    bonus_points: 1,
  });

  await BonusRequirement.create({
    requirement_id: 4,
    threshold_percentage: 50,
    bonus_points: 3,
  });

  await BonusRequirement.create({
    requirement_id: 4,
    threshold_percentage: 100,
    bonus_points: 5,
  });

  await MembershipRequirement.create({
    organization_id: org2.organization_id,
    event_type: "committee",
    requirement_type: "points",
    requirement_value: 5,
  });

  await BonusRequirement.create({
    requirement_id: 5,
    threshold_percentage: 50,
    bonus_points: 1,
  });

  await BonusRequirement.create({
    requirement_id: 5,
    threshold_percentage: 100,
    bonus_points: 3,
  });

  await MembershipRequirement.create({
    organization_id: org2.organization_id,
    event_type: "volunteer",
    requirement_type: "points",
    requirement_value: 1,
  });

  // Events
  console.log("7. Adding Events");
  const event1 = await Event.create({
    organization_id: org1.organization_id,
    event_name: "WiC general_meeting",
    event_start: "2025-02-05 18:00:00",
    event_end: "2025-02-05 19:30:00",
    event_location: "GOL 1400",
    event_description: "An overview of upcoming events and initiatives.",
    event_type: "general_meeting",
    semester_id: sem2.semester_id,
  });
  const event2 = await Event.create({
    organization_id: org1.organization_id,
    event_name: "WiC Volunteer Day",
    event_start: "2025-03-10 10:00:00",
    event_end: "2025-03-10 14:00:00",
    event_location: "Local Community Center",
    event_description:
      "Helping out at the community center with tech workshops.",
    event_type: "volunteer",
    semester_id: sem2.semester_id,
  });

  const event3 = await Event.create({
    organization_id: org1.organization_id,
    event_name: "WiC Social Night",
    event_start: "2025-04-15 19:00:00",
    event_end: "2025-04-15 22:00:00",
    event_location: "Java's Café",
    event_description: "A night of networking, games, and fun!",
    event_type: "social",
    semester_id: sem2.semester_id,
  });
  const event4 = await Event.create({
    organization_id: org2.organization_id,
    event_name: "COMS Workshop: Resume Building",
    event_start: "2025-02-12 17:30:00",
    event_end: "2025-02-12 19:00:00",
    event_location: "GOL 2250",
    event_description:
      "Learn how to craft a compelling resume with industry professionals.",
    event_type: "workshop",
    semester_id: sem2.semester_id,
  });
  const event5 = await Event.create({
    organization_id: org2.organization_id,
    event_name: "COMS Charity Fundraiser",
    event_start: "2025-03-20 18:00:00",
    event_end: "2025-03-20 21:00:00",
    event_location: "RIT Ballroom",
    event_description:
      "A night of fundraising for a local cause with guest speakers.",
    event_type: "fundraiser",
    semester_id: sem2.semester_id,
  });
  const event6 = await Event.create({
    organization_id: org2.organization_id,
    event_name: "COMS Committee Brainstorming",
    event_start: "2025-04-10 16:00:00",
    event_end: "2025-04-10 18:00:00",
    event_location: "GOL 3000",
    event_description:
      "Collaborate and plan initiatives for the next semester.",
    event_type: "committee",
    semester_id: sem2.semester_id,
  });

  // Events
  console.log("8. Adding Attendance");

  // wic events
  await Attendance.create({
    member_id: member1.member_id,
    event_id: event1.event_id,
    check_in: "2025-02-05 18:01:00",
  });
  await Attendance.create({
    member_id: member2.member_id,
    event_id: event1.event_id,
    check_in: "2025-02-05 18:02:00",
  });

  await Attendance.create({
    member_id: member3.member_id,
    event_id: event2.event_id,
    check_in: "2025-03-10 12:00:00",
  });
  await Attendance.create({
    member_id: member4.member_id,
    event_id: event2.event_id,
    check_in: "2025-03-10 10:01:00",
  });

  await Attendance.create({
    member_id: member5.member_id,
    event_id: event3.event_id,
    check_in: "2025-04-15 19:01:00",
  });
  await Attendance.create({
    member_id: member6.member_id,
    event_id: event3.event_id,
    check_in: "2025-04-15 20:00:00",
  });
  await Attendance.create({
    member_id: member7.member_id,
    event_id: event3.event_id,
    check_in: "2025-04-15 21:00:00",
  });

  // coms events

  await Attendance.create({
    member_id: member1.member_id,
    event_id: event4.event_id,
    check_in: "2025-02-12 18:00:00",
  });
  await Attendance.create({
    member_id: member2.member_id,
    event_id: event4.event_id,
    check_in: "2025-02-12 18:30:00",
  });

  await Attendance.create({
    member_id: member3.member_id,
    event_id: event5.event_id,
    check_in: "2025-03-20 18:01:00",
  });
  await Attendance.create({
    member_id: member4.member_id,
    event_id: event5.event_id,
    check_in: "2025-03-20 18:02:00",
  });

  await Attendance.create({
    member_id: member5.member_id,
    event_id: event6.event_id,
    check_in: "2025-04-10 16:01:00",
  });
  await Attendance.create({
    member_id: member6.member_id,
    event_id: event6.event_id,
    check_in: "2025-04-10 16:30:00",
  });
  await Attendance.create({
    member_id: member7.member_id,
    event_id: event6.event_id,
    check_in: "2025-04-10 17:00:00",
  });

  // Finishing up
  console.log("\nFinishing up...");
  console.log("This may take a couple minutes...wait for the script to end");
}

(async () => {
  addTestData();
})();

/**
 *
 * WHAT DO THE TABLES LOOK LIKE NOW?
 * IDs will vary -> they are auto-generated 
 * (other than semester ids, they will stay the same)
 *
 * ORGANIZATION
  +-----------------+-------------------+----------------------------------+--------------------+---------------------------+------------------------+---------------------+---------------------+
| organization_id | organization_name | organization_description         | organization_color | organization_abbreviation | organization_threshold | createdAt           | updatedAt           |
+-----------------+-------------------+----------------------------------+--------------------+---------------------------+------------------------+---------------------+---------------------+
|              35 | WiC TEST ONLY     | This is a test for WiC Settings  | #381A58            | NULL                      |                     42 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|              36 | COMS TEST ONLY    | This is a test for COMS Settings | #20BDE4            | NULL                      |                     23 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
+-----------------+-------------------+----------------------------------+--------------------+---------------------------+------------------------+---------------------+---------------------+


SEMESTER
+-------------+------------------+---------------+---------------------+---------------------+---------------------+---------------------+
| semester_id | semester_name    | academic_year | start_date          | end_date            | createdAt           | updatedAt           |
+-------------+------------------+---------------+---------------------+---------------------+---------------------+---------------------+
|        1123 | 2024 FALL TEST   | 2024-2025     | 2024-08-14 00:00:00 | 2024-12-16 00:00:00 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        1124 | 2025 SPRING TEST | 2024-2025     | 2025-01-14 00:00:00 | 2024-05-02 00:00:00 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
+-------------+------------------+---------------+---------------------+---------------------+---------------------+---------------------+
2 rows in set (0.001 sec)


MEMBER
+-----------+--------------------------+-----------------+------------------------------------+---------------------+------------------------+--------------------+----------------------------+---------------+-------------+---------------+---------------------+---------------------+
| member_id | member_name              | member_email    | member_personal_email              | member_phone_number | member_graduation_date | member_tshirt_size | member_major               | member_gender | member_race | member_status | createdAt           | updatedAt           |
+-----------+--------------------------+-----------------+------------------------------------+---------------------+------------------------+--------------------+----------------------------+---------------+-------------+---------------+---------------------+---------------------+
|        88 | Maija Philip             | mep4741@rit.edu | maija.philip@gmail.com             | NULL                | 2025-05-10 00:00:00    | S                  | Web and Mobile Computing   | F             | White       | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        89 | Max Stein                | mhs8558@rit.edu | max.stein@gmail.com                | NULL                | 2025-05-10 00:00:00    | M                  | Web and Mobile Computing   | M             | White       | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        90 | Divna Mijic              | dm9718@rit.edu  | divna.mijic@gmail.com              | NULL                | 2025-05-10 00:00:00    | S                  | Web and Mobile Computing   | F             | White       | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        91 | Kasim O'Meally           | klo7619@rit.edu | kasim.omeally@gmail.com            | NULL                | 2025-05-10 00:00:00    | NULL               | Web and Mobile Computing   | NULL          | NULL        | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        92 | Joseph Henry             | jdh6459@rit.edu | joseph.henry@gmail.com             | NULL                | 2025-05-10 00:00:00    | NULL               | Web and Mobile Computing   | NULL          | NULL        | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        93 | Alexandria Eddings       | aze6809@rit.edu | alexandria.eddings@gmail.com       | NULL                | 2025-05-10 00:00:00    | NULL               | Web and Mobile Computing   | NULL          | NULL        | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
|        94 | Gabriella Alvarez-Mcleod | gma5228@rit.edu | Gabriella.alvarez-mcleod@gmail.com | NULL                | 2025-05-10 00:00:00    | NULL               | Human Computer Interaction | NULL          | NULL        | undergraduate | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |
+-----------+--------------------------+-----------------+------------------------------------+---------------------+------------------------+--------------------+----------------------------+---------------+-------------+---------------+---------------------+---------------------+
7 rows in set (0.001 sec)


MEMBERSHIPS
+---------------+-----------------+-------------------+---------------+------------------+---------------------+---------------------+-----------+-----------------+-------------+
| membership_id | membership_role | membership_points | active_member | active_semesters | createdAt           | updatedAt           | member_id | organization_id | semester_id |
+---------------+-----------------+-------------------+---------------+------------------+---------------------+---------------------+-----------+-----------------+-------------+
|            71 |               2 |                36 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        88 |              35 |        1123 |
|            72 |               2 |                15 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        88 |              35 |        1123 |
|            73 |               2 |                 2 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        89 |              35 |        1123 |
|            74 |               2 |                20 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        89 |              35 |        1123 |
|            75 |               2 |                37 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        90 |              35 |        1123 |
|            76 |               2 |                12 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        90 |              35 |        1123 |
|            77 |               2 |                 1 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        91 |              35 |        1123 |
|            78 |               2 |                14 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        91 |              35 |        1123 |
|            79 |               2 |                18 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        92 |              35 |        1123 |
|            80 |               2 |                36 |             1 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        92 |              35 |        1123 |
|            81 |               2 |                10 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        93 |              35 |        1123 |
|            82 |               2 |                31 |             1 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        93 |              35 |        1123 |
|            83 |               2 |                29 |             0 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        94 |              35 |        1123 |
|            84 |               2 |                28 |             1 |                1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        94 |              35 |        1123 |
+---------------+-----------------+-------------------+---------------+------------------+---------------------+---------------------+-----------+-----------------+-------------+
14 rows in set (0.001 sec)



EMAIL SETTINGS
+------------------+----------------+---------------+-----------------+---------------------+---------------------+---------------------+-----------------+
| email_setting_id | current_status | annual_report | semester_report | membership_achieved | createdAt           | updatedAt           | organization_id |
+------------------+----------------+---------------+-----------------+---------------------+---------------------+---------------------+-----------------+
|                7 |              1 |             0 |               1 |                   0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |
|                8 |              0 |             0 |               1 |                   1 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |
+------------------+----------------+---------------+-----------------+---------------------+---------------------+---------------------+-----------------+


MEMBERSHIP REQUIREMENTS
+----------------+--------------+------------+-------------+--------+-------------------+---------------------+---------------------+-----------------+
| requirement_id | event_type | frequency  | requirement_type | requirement_value | requirement_scope | createdAt           | updatedAt           | organization_id |
+----------------+--------------+------------+-------------+--------+-------------------+---------------------+---------------------+-----------------+
|             14 | Meeting      | Semesterly | points      |      4 | semesterly        | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |
|             15 | Event        | Yearly     | points      |      2 | annually          | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |
|             16 | Volunteer    | Semesterly | percentage  |     50 | semesterly        | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |
|             17 | Meeting      | Yearly     | points      |      1 | annually          | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |
|             18 | Event        | Semesterly | percentage  |     25 | semesterly        | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |
|             19 | Volunteer    | Semesterly | percentage  |     50 | semesterly        | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |
+----------------+--------------+------------+-------------+--------+-------------------+---------------------+---------------------+-----------------+
6 rows in set (0.001 sec)


EVENTS
+----------+--------------------------------+---------------------+---------------------+------------------------+---------------------------------------------------------------------+-----------------+---------------------+---------------------+-----------------+-------------+
| event_id | event_name                     | event_start         | event_end           | event_location         | event_description                                                   | event_type      | createdAt           | updatedAt           | organization_id | semester_id |
+----------+--------------------------------+---------------------+---------------------+------------------------+---------------------------------------------------------------------+-----------------+---------------------+---------------------+-----------------+-------------+
|        7 | WiC general_meeting            | 2025-02-05 23:00:00 | 2025-02-06 00:30:00 | GOL 1400               | An overview of upcoming events and initiatives.                     | general_meeting | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |        NULL |
|        8 | WiC Volunteer Day              | 2025-03-10 14:00:00 | 2025-03-10 18:00:00 | Local Community Center | Helping out at the community center with tech workshops.            | volunteer       | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |        NULL |
|        9 | WiC Social Night               | 2025-04-15 23:00:00 | 2025-04-16 02:00:00 | Java's Café            | A night of networking, games, and fun!                              | social          | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              35 |        NULL |
|       10 | COMS Workshop: Resume Building | 2025-02-12 22:30:00 | 2025-02-13 00:00:00 | GOL 2250               | Learn how to craft a compelling resume with industry professionals. | workshop        | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |        NULL |
|       11 | COMS Charity Fundraiser        | 2025-03-20 22:00:00 | 2025-03-21 01:00:00 | RIT Ballroom           | A night of fundraising for a local cause with guest speakers.       | fundraiser      | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |        NULL |
|       12 | COMS Committee Brainstorming   | 2025-04-10 20:00:00 | 2025-04-10 22:00:00 | GOL 3000               | Collaborate and plan initiatives for the next semester.             | committee       | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |              36 |        NULL |
+----------+--------------------------------+---------------------+---------------------+------------------------+---------------------------------------------------------------------+-----------------+---------------------+---------------------+-----------------+-------------+
6 rows in set (0.001 sec)


ATTENDANCE
+---------------+---------------------+-----------------+---------------------+---------------------+-----------+----------+
| attendance_id | check_in            | volunteer_hours | createdAt           | updatedAt           | member_id | event_id |
+---------------+---------------------+-----------------+---------------------+---------------------+-----------+----------+
|             3 | 2025-02-05 23:01:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        88 |        7 |
|             4 | 2025-02-05 23:02:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        89 |        7 |
|             5 | 2025-03-10 16:00:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        90 |        8 |
|             6 | 2025-03-10 14:01:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        91 |        8 |
|             7 | 2025-04-15 23:01:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        92 |        9 |
|             8 | 2025-04-16 00:00:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        93 |        9 |
|             9 | 2025-04-16 01:00:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        94 |        9 |
|            10 | 2025-02-12 23:00:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        88 |       10 |
|            11 | 2025-02-12 23:30:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        89 |       10 |
|            12 | 2025-03-20 22:01:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        90 |       11 |
|            13 | 2025-03-20 22:02:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        91 |       11 |
|            14 | 2025-04-10 20:01:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        92 |       12 |
|            15 | 2025-04-10 20:30:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        93 |       12 |
|            16 | 2025-04-10 21:00:00 |               0 | 2025-02-18 23:19:09 | 2025-02-18 23:19:09 |        94 |       12 |
+---------------+---------------------+-----------------+---------------------+---------------------+-----------+----------+
14 rows in set (0.001 sec)


 */
