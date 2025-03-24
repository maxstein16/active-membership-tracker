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
const { Op } = require("sequelize");

async function addTestData() {
  // Delete old test data
  // console.log("Deleting old test data...");
  // await deleteOldTestData();

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
    organization_threshold: 0,
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

  // SEMESTERS - EXPANDED TO INCLUDE PREVIOUS ACADEMIC YEAR
  console.log("2. Creating Test Semesters");

  const sem1 = await Semester.create({
    semester_id: 1121,
    semester_name: "2023 FALL TEST",
    academic_year: "2023-2024",
    start_date: "2023-08-15",
    end_date: "2023-12-18",
  });

  const sem2 = await Semester.create({
    semester_id: 1122,
    semester_name: "2024 SPRING TEST",
    academic_year: "2023-2024",
    start_date: "2024-01-16",
    end_date: "2024-05-04",
  });

  const sem3 = await Semester.create({
    semester_id: 1123,
    semester_name: "2024 FALL TEST",
    academic_year: "2024-2025",
    start_date: "2024-08-14",
    end_date: "2024-12-16",
  });

  const sem4 = await Semester.create({
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

  // Memberships FOR ALL SEMESTERS
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
  
  const semesters = [sem1, sem2, sem3, sem4];
  
  // Create memberships for each semester for each member
  for (const semester of semesters) {
    console.log(`Creating memberships for ${semester.semester_name}`);
    
    for (const member of members) {
      const allPossibleBonusIds = [1, 2, 3, 4, 5];
      const numBonuses = Math.floor(Math.random() * 4);
      const shuffled = allPossibleBonusIds.sort(() => 0.5 - Math.random());
      const selectedBonuses = shuffled.slice(0, numBonuses);
      
      // Vary the active state more for historical data
      const isActive = Math.random() > 0.3; // 70% chance of being active
      const activeSemesters = semester.semester_id === 1124 ? 1 : Math.floor(Math.random() * 4) + 1; // 1-4 for old semesters
      
      // Membership for WiC (attendance-based)
      const wicPoints = Math.floor(Math.random() * 12); // Random attendance count 0-11
      await Membership.create({
        membership_role: Math.random() > 0.8 ? 1 : 2, // 20% chance of being eboard (role 1)
        member_id: member.member_id,
        organization_id: org1.organization_id,
        semester_id: semester.semester_id,
        membership_points: wicPoints,
        active_member: wicPoints >= 8, // Active if attended enough meetings
        received_bonus: [],
        active_semesters: activeSemesters,
      });

      // Membership for COMS (points-based)
      const randomNum = Math.floor(Math.random() * 40) + 1;
      await Membership.create({
        membership_role: Math.random() > 0.9 ? 1 : 2, // 10% chance of being eboard (role 1)
        member_id: member.member_id,
        organization_id: org2.organization_id,
        semester_id: semester.semester_id,
        membership_points: randomNum,
        active_member: randomNum >= 23,
        received_bonus: selectedBonuses,
        active_semesters: activeSemesters,
      });
    }
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

  // Events for ALL semesters
  console.log("7. Adding Events for all semesters");
  
  // Function to create date within semester bounds
  const getRandomDateInSemester = (semester) => {
    const start = new Date(semester.start_date);
    const end = new Date(semester.end_date);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
  };
  
  // Create events for each semester
  for (const semester of semesters) {
    console.log(`Creating events for ${semester.semester_name}`);
    
    // ======= WiC EVENTS =======
    // General Meetings
    const wicGeneralMeeting1 = await Event.create({
      organization_id: org1.organization_id,
      event_name: `WiC General Meeting 1 - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 90 * 60000), // 90 minutes later
      event_location: "GOL 1400",
      event_description: "First general meeting of the semester.",
      event_type: "general_meeting",
      semester_id: semester.semester_id,
    });
    
    const wicGeneralMeeting2 = await Event.create({
      organization_id: org1.organization_id,
      event_name: `WiC General Meeting 2 - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 90 * 60000),
      event_location: "GOL 1400",
      event_description: "Second general meeting of the semester.",
      event_type: "general_meeting",
      semester_id: semester.semester_id,
    });
    
    // Social Events
    const wicSocial = await Event.create({
      organization_id: org1.organization_id,
      event_name: `WiC Social Night - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 180 * 60000), // 3 hours
      event_location: "Java's Café",
      event_description: "A night of networking, games, and fun!",
      event_type: "social",
      semester_id: semester.semester_id,
    });
    
    // Volunteer Events
    const wicVolunteer = await Event.create({
      organization_id: org1.organization_id,
      event_name: `WiC Volunteer Day - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 240 * 60000), // 4 hours
      event_location: "Local Community Center",
      event_description: "Helping out at the community center with tech workshops.",
      event_type: "volunteer",
      semester_id: semester.semester_id,
    });
    
    // ======= COMS EVENTS =======
    // Workshops
    const comsWorkshop = await Event.create({
      organization_id: org2.organization_id,
      event_name: `COMS Workshop: Resume Building - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 90 * 60000),
      event_location: "GOL 2250",
      event_description: "Learn how to craft a compelling resume with industry professionals.",
      event_type: "workshop",
      semester_id: semester.semester_id,
    });
    
    // Fundraisers
    const comsFundraiser = await Event.create({
      organization_id: org2.organization_id,
      event_name: `COMS Charity Fundraiser - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 180 * 60000),
      event_location: "RIT Ballroom",
      event_description: "A night of fundraising for a local cause with guest speakers.",
      event_type: "fundraiser",
      semester_id: semester.semester_id,
    });
    
    // Committee Meetings
    const comsCommittee = await Event.create({
      organization_id: org2.organization_id,
      event_name: `COMS Committee Brainstorming - ${semester.semester_name}`,
      event_start: getRandomDateInSemester(semester),
      event_end: new Date(new Date(getRandomDateInSemester(semester)).getTime() + 120 * 60000), // 2 hours
      event_location: "GOL 3000",
      event_description: "Collaborate and plan initiatives for the next semester.",
      event_type: "committee",
      semester_id: semester.semester_id,
    });
    
    // Create attendance for each event
    const allEvents = [
      wicGeneralMeeting1, 
      wicGeneralMeeting2, 
      wicSocial, 
      wicVolunteer,
      comsWorkshop,
      comsFundraiser,
      comsCommittee
    ];
    
    console.log(`Creating attendance records for ${semester.semester_name}`);
    
    for (const event of allEvents) {
      // Determine how many members attended (between 3-7)
      const numAttendees = Math.floor(Math.random() * 5) + 3;
      
      // Shuffle members list to get random attendees
      const shuffledMembers = [...members].sort(() => 0.5 - Math.random());
      const attendees = shuffledMembers.slice(0, numAttendees);
      
      // Create attendance records
      for (const attendee of attendees) {
        const checkInTime = new Date(event.event_start);
        // Add random minutes (0-30) for check-in time variation
        checkInTime.setMinutes(checkInTime.getMinutes() + Math.floor(Math.random() * 30));
        
        await Attendance.create({
          member_id: attendee.member_id,
          event_id: event.event_id,
          check_in: checkInTime,
          volunteer_hours: event.event_type === "volunteer" ? Math.floor(Math.random() * 4) + 1 : 0, // 1-4 hours for volunteer events
        });
      }
    }
  }

  // Adding more detailed event + attendance data for current semester (sem4) for better reporting
  console.log("8. Adding additional detailed events for current semester");
  
  // Additional WiC events for current semester - USING VALID EVENT TYPES
  const additionalWicEvents = [
    {
      event_name: "WiC Workshop: Git Basics",
      event_type: "workshop", // This is a valid event type from the original script
      event_location: "GOL 2400",
      event_description: "Learn the basics of Git and GitHub for version control.",
    },
    {
      event_name: "WiC Industry Talk", // Changed from "Panel" to "Talk"
      event_type: "social", // Changed to a valid event type
      event_location: "GOL Auditorium",
      event_description: "Hear from women in tech about their career journeys.",
    },
    {
      event_name: "WiC Technical Interview Prep",
      event_type: "workshop", 
      event_location: "GOL 1440",
      event_description: "Practice technical interviews with peers and industry mentors.",
    }
  ];
  
  // Additional COMS events for current semester - USING VALID EVENT TYPES
  const additionalComsEvents = [
    {
      event_name: "COMS Game Night",
      event_type: "social",
      event_location: "MAGIC Center",
      event_description: "A fun night of video games and board games.",
    },
    {
      event_name: "COMS Coding Competition", // Changed from "Hackathon"
      event_type: "volunteer", // Changed to valid event type
      event_location: "MAGIC Center",
      event_description: "24-hour coding competition with prizes.",
    },
    {
      event_name: "COMS Career Fair Prep",
      event_type: "workshop",
      event_location: "GOL 1440",
      event_description: "Get ready for the career fair with resume reviews and mock interviews.",
    }
  ];
  
  // Add additional WiC events
  for (const eventData of additionalWicEvents) {
    const eventDate = getRandomDateInSemester(sem4);
    const event = await Event.create({
      organization_id: org1.organization_id,
      event_name: eventData.event_name,
      event_start: eventDate,
      event_end: new Date(eventDate.getTime() + 120 * 60000), // 2 hours
      event_location: eventData.event_location,
      event_description: eventData.event_description,
      event_type: eventData.event_type,
      semester_id: sem4.semester_id,
    });
    
    // Create attendance for each event (4-6 attendees)
    const numAttendees = Math.floor(Math.random() * 3) + 4;
    const shuffledMembers = [...members].sort(() => 0.5 - Math.random());
    const attendees = shuffledMembers.slice(0, numAttendees);
    
    for (const attendee of attendees) {
      const checkInTime = new Date(event.event_start);
      checkInTime.setMinutes(checkInTime.getMinutes() + Math.floor(Math.random() * 30));
      
      await Attendance.create({
        member_id: attendee.member_id,
        event_id: event.event_id,
        check_in: checkInTime,
      });
    }
  }
  
  // Add additional COMS events
  for (const eventData of additionalComsEvents) {
    const eventDate = getRandomDateInSemester(sem4);
    const event = await Event.create({
      organization_id: org2.organization_id,
      event_name: eventData.event_name,
      event_start: eventDate,
      event_end: new Date(eventDate.getTime() + 120 * 60000), // 2 hours
      event_location: eventData.event_location,
      event_description: eventData.event_description,
      event_type: eventData.event_type,
      semester_id: sem4.semester_id,
    });
    
    // Create attendance for each event (4-6 attendees)
    const numAttendees = Math.floor(Math.random() * 3) + 4;
    const shuffledMembers = [...members].sort(() => 0.5 - Math.random());
    const attendees = shuffledMembers.slice(0, numAttendees);
    
    for (const attendee of attendees) {
      const checkInTime = new Date(event.event_start);
      checkInTime.setMinutes(checkInTime.getMinutes() + Math.floor(Math.random() * 30));
      
      await Attendance.create({
        member_id: attendee.member_id,
        event_id: event.event_id,
        check_in: checkInTime,
      });
    }
  }

  // Finishing up
  console.log("\nFinishing up...");
  console.log("This may take a couple minutes...wait for the script to end");
  console.log("Added test data across 4 semesters for both organizations");
  console.log("Added total events: " + (7 * 4 + additionalWicEvents.length + additionalComsEvents.length));
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
