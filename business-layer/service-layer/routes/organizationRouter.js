let express = require("express");
const router = express.Router();

/*

https://api.rit.edu/v1/organization/{orgId}

*/

// GET /v1/organization/{orgId}
router.get("/", function (req, res) {
  res.status(200).json({ 
    "status": "success",
    "data": {
      "organization_id": 1,
      "organization_name": "Women In Computing",
      "organization_abbreviation": "WiC",
      "organization_desc": "Our Mission is to build a supportive community that celebrates the talent of underrepresented students in Computing. We work to accomplish our mission by providing mentorship, mental health awareness, and leadership opportunities.",
      "organization_color": 0x123456,
      "active_membership_threshold": 48
      }, 
      org: req.params.orgId
    }); 
  res.status(400).json({ error: "organization with id of {orgId} not found"});
  res.status(400).json({ error: "Must include an organization id in your call" });
});

router.post("/", function (req, res) {
  res.status(200).json({ 
    "status": "success",
    "data": {
      "organization_id": 1,
      "organization_name": "Women In Computing",
      "organization_abbreviation": "WiC",
      "organization_desc": "Our Mission is to build a supportive community that celebrates the talent of underrepresented students in Computing. We work to accomplish our mission by providing mentorship, mental health awareness, and leadership opportunities.",
      "organization_color": 0x123456,
      "active_membership_threshold": 48 }
    });

    res.status(400).json({ error: "Must include at least one valid field to edit: organization_name, organization_abbreviation, organization_desc, organization_color, active_membership_threshold" });

    res.status(404).json({ error: "organization with id of {orgId} not found" });

    res.status(500).json({ error: "Something went wrong" });

});

module.exports = router;
