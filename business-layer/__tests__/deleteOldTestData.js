const { Organization, Semester, Member, Membership, EmailSettings, MembershipRequirement } = require("../db");

// RUN WITH ADD TEST DATA
async function deleteOldTestData() {

  let result = undefined;

  // get Org Ids
  let org1Id = await Organization.findOne({
    where: { organization_name: "WiC TEST ONLY" },
  });
  org1Id = org1Id.organization_id;

  let org2Id = await Organization.findOne({
    where: { organization_name: "COMS TEST ONLY" },
  });
  org2Id = org2Id.organization_id;



  // delete events
  result = await Event.destroy({
    where: { organization_id: org1Id }
  })  
  result = await Event.destroy({
    where: { organization_id: org2Id }
  })  


  // delete membership requirements
  result = await MembershipRequirement.destroy({
    where: { organization_id: org1Id }
  })  
  result = await MembershipRequirement.destroy({
    where: { organization_id: org2Id }
  })  

  // delete email settings
  result = await EmailSettings.destroy({
    where: { organization_id: org1Id }
  })  
  result = await EmailSettings.destroy({
    where: { organization_id: org2Id }
  }) 

  // delete memberships
  result = await Membership.destroy({
    where: { organization_id: org1Id }
  })  
  result = await Membership.destroy({
    where: { organization_id: org2Id }
  })  

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

  // delete semesters
  result = await Semester.destroy({
    where: { semester_name: "2024 FALL TEST" },
  });

  result = await Semester.destroy({
    where: { semester_name: "2025 SPRING TEST" },
  });

  // delete organizations
  result = await Organization.destroy({
    where: { organization_name: "WiC TEST ONLY" },
  });

  result = await Organization.destroy({
    where: { organization_name: "COMS TEST ONLY" },
  });
}

module.exports = {
  deleteOldTestData,
};
