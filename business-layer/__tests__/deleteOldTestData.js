const { Organization, Semester, Member } = require("../db");

// RUN WITH ADD TEST DATA
async function deleteOldTestData() {
  // delete organizations
  let result = await Organization.destroy({
    where: { organization_name: "WiC TEST ONLY" },
  });

  result = await Organization.destroy({
    where: { organization_name: "COMS TEST ONLY" },
  });

  // delete semesters
  result = await Semester.destroy({
    where: { semester_name: "2024 FALL TEST" },
  });

  result = await Semester.destroy({
    where: { semester_name: "2025 SPRING TEST" },
  });

  // delete members
  result = await Member.destroy({
    where: { member_email: "mep4741@rit.edu" },
  });

  result = await Member.destroy({
    where: { member_email: "mhs8558@rit.edu" },
  });

  result = await Member.destroy({
    where: { member_email: "dm9718@rit.edu" },
  });

  result = await Member.destroy({
    where: { member_email: "klo7619@rit.edu" },
  });

  result = await Member.destroy({
    where: { member_email: "jdh6459@rit.edu" },
  });

  result = await Member.destroy({
    where: { member_email: "aze6809@rit.edu" },
  });

  result = await Member.destroy({
    where: { member_email: "gma5228@rit.edu" },
  });
}

module.exports = {
  deleteOldTestData,
};
