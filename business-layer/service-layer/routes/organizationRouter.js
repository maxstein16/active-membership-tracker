let express = require("express");
const router = express.Router();

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

/* https://api.rit.edu/v1/organization/{orgId} */

// GET /v1/organization/{orgId}
router.get("/:orgId", async function (req, res) {
  //sanitize
  let orgId = sanitizer.sanitize(req.params.orgId);

  //checking if params are valid
  if(!orgId || isNaN(orgId)){
    return res.status(400).json({ error: "organization with id of ${orgId} not found"});
  }

  //send off to backend
  var orgInfo = await business.getSpecificOrganizationData(orgId);
 
  // Handle errors from data returned from backend
  if(!orgInfo) {
    return res.status(404).json({ error: "Must include an organization id in your call" });
  }

  //return data
  res.status(200).json({ 
    "status": "success",
    "data": {
      "organization_id": req.params.orgId,
      "organization_name": orgInfo.organization_name,
      "organization_abbreviation": orgInfo.organization_abbreviation,
      "organization_desc": orgInfo.organization_desc,
      "organization_color": orgInfo.organization_color,
      "active_membership_threshold": orgInfo.active_membership_threshold
      }
    }); 
});

// POST /v1/organization/
router.post("/", async function (req, res) {

 //sanitize
  let orgName = sanitizer.sanitize(req.params.organization_name);
  let orgShortened = sanitizer.sanitize(req.params.organization_abbreviation);
  let orgDesc = sanitizer.sanitize(req.params.organization_desc);
  let orgColor = sanitizer.sanitize(req.params.organization_color);
  let memberThreshold = sanitizer.sanitize(req.params.active_membership_threshold);

  //checking if params are valid
  if(!memberThreshold || isNaN(memberThreshold) || !orgName || !orgShortened || !orgDesc || !orgColor){
    return res.status(404).json({ error: "Cannot add new organization. Organization incorrectly formatted."});
  }

  //send off to backend
  var orgInfo = await business.addOrganization(req.params);

  // Handle errors from data returned from backend
  if(!orgInfo) {
    return res.status(400).json({ error: "Must include all valid fields: organization_name, organization_abbreviation, organization_desc, organization_color, active_membership_threshold" });
  }

  res.status(200).json({ 
    "status": "success",
    "data": {
      "organization_id": req.params.orgId,
      "organization_name": orgName,
      "organization_abbreviation": orgShortened,
      "organization_desc": orgDesc,
      "organization_color": orgColor,
      "active_membership_threshold": memberThreshold }
    });

  //  res.status(500).json({ error: "Something went wrong" });
});


//PUT /v1/organization/{orgId}
router.put("/:orgId", async function (req, res) {

 //sanitize
 let orgId = sanitizer.sanitize(req.params.orgId);  

    //checking if params are valid
  if(!orgId || isNaN(orgId)){
    return res.status(404).json({ error: "organization with id of ${orgId} not found"});
  }

  let updatedOrgData = await business.editOrganization(orgId, req.params);
    
  if(!updatedOrgData) {
    return res.status(400).json({ error: "Must include at least one valid field to edit: organization_name, organization_abbreviation, organization_desc, organization_color, active_membership_threshold" });
   }
  

  res.status(200).json({
      "status": "success",
      "data": {
        "organization_id": updatedOrgData,
        "organization_name": "Women In Computing",
        "organization_abbreviation": "WiC",
        "organization_desc": "Our Mission is to build a supportive community that celebrates the talent of underrepresented students in Computing. We work to accomplish our mission by providing mentorship, mental health awareness, and leadership opportunities.",
        "organization_color": 0x123456,
        "active_membership_threshold": 48 
        }
    });


  //res.status(500).json({  error: "Something went wrong" });

});

module.exports = router;
