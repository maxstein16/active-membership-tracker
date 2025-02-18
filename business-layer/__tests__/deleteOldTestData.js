const { Organization, Semester, Member, Membership, EmailSettings, MembershipRequirement, Attendance, Event } = require("../db");

// RUN WITH ADD TEST DATA
async function deleteOldTestData() {

  let result = undefined;

  // get Org Ids
  let org1Id = await Organization.findOne({
    where: { organization_name: "WiC TEST ONLY" },
  });

  if (!org1Id) {
    return;
  }
  org1Id = org1Id.organization_id;

  let org2Id = await Organization.findOne({
    where: { organization_name: "COMS TEST ONLY" },
  });
  org2Id = org2Id.organization_id;


  // get member ids 
  const members = ["mep4741@rit.edu", "mhs8558@rit.edu", "dm9718@rit.edu", "klo7619@rit.edu", "jdh6459@rit.edu", "aze6809@rit.edu", "gma5228@rit.edu"]

  for (let member of members) {

    let memberInfo = await Member.findOne({
      where: { member_email: member },
    });

    // delete attendance 
    result = await Attendance.destroy({
      where: { member_id: memberInfo.member_id }
    })
  }


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
  for (const member of members) {
    result = await Member.destroy({
      where: { member_email: member },
    });
  }
  
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
