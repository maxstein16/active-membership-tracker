/**
 * THIS FILE ADDS TEST DATA TO THE DB
 *
 * HOW TO RUN
 * cd ./active-membership-tracker/business-layer
 * node  ./__tests__/addTestData.js
 */

const { Organization, Semester, Member } = require("../db");
const { deleteOldTestData } = require("./deleteOldTestData");

async function addTestData() {
  // Delete old test data
  console.log("Deleting old test data...");
  await deleteOldTestData();

  console.log("\n\nAdding test data to Database...");
  
  // ORGANIZATION
  console.log("\n1. Creating Test Organizations");
  await Organization.create({
    organization_name: "WiC TEST ONLY",
    organization_description: "This is a test for WiC Settings",
    organization_color: "#381A58",
    org_abbreviation: "WiC TEST",
    organization_threshold: 42,
  });

  await Organization.create({
    organization_name: "COMS TEST ONLY",
    organization_description: "This is a test for COMS Settings",
    organization_color: "#20BDE4",
    org_abbreviation: "COMS TEST",
    organization_threshold: 23,
  });

  // SEMESTERS
  console.log("2. Creating Test Semesters");

  await Semester.create({
    semester_name: "2024 FALL TEST",
    academic_year: "2024 - 2025",
    start_date: "2024-08-14",
    end_date: "2024-12-16",
  });

  await Semester.create({
    semester_name: "2025 SPRING TEST",
    academic_year: "2024 - 2025",
    start_date: "2025-01-14",
    end_date: "2024-05-02",
  });

  // MEMBERS
  console.log("3. Creating Test Members");

  await Member.create({
    member_name: "Maija Philip",
    member_email: "mep4741@rit.edu",
    member_personal_email: "maija.philip@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "S",
    member_major: "Web and Mobile Computing",
    member_gender: "F",
    member_race: "White",
  });

  await Member.create({
    member_name: "Max Stein",
    member_email: "mhs8558@rit.edu",
    member_personal_email: "max.stein@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "M",
    member_major: "Web and Mobile Computing",
    member_gender: "M",
    member_race: "White",
  });

  await Member.create({
    member_name: "Divna Mijic",
    member_email: "dm9718@rit.edu",
    member_personal_email: "divna.mijic@gmail.com",
    member_graduation_date: "2025-05-10",
    member_tshirt_size: "S",
    member_major: "Web and Mobile Computing",
    member_gender: "F",
    member_race: "White",
  });

  await Member.create({
    member_name: "Kasim O'Meally",
    member_email: "klo7619@rit.edu",
    member_personal_email: "kasim.omeally@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
  });

  await Member.create({
    member_name: "Joseph Henry",
    member_email: "jdh6459@rit.edu",
    member_personal_email: "joseph.henry@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
  });

  await Member.create({
    member_name: "Alexandria Eddings",
    member_email: "aze6809@rit.edu",
    member_personal_email: "alexandria.eddings@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Web and Mobile Computing",
  });

  await Member.create({
    member_name: "Gabriella Alvarez-Mcleod",
    member_email: "gma5228@rit.edu",
    member_personal_email: "Gabriella.alvarez-mcleod@gmail.com",
    member_graduation_date: "2025-05-10",
    member_major: "Human Computer Interaction",
  });
}

(async () => { addTestData()})();
