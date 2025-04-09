let express = require("express");
require("dotenv").config(); // Load .env variables
const isNewUser = require("../../business-logic-layer/public/isNewUser");
const router = express.Router({ mergeParams: true });

/*
https://api.rit.edu/v1/session
*/

// GET /v1/session
router.get("/", function (req, res) {
  if (req.session.user == null) {
    res.status(404).json({ error: `No session` });
    return;
  }
  res.status(200).json({ status: "success", "session-data": req.session });
});

//TODO this should be automatic upon login, not a call... but we don't have a login flow yet
router.get("/login", function (req, res) {
  if (process.env.LOCATION === "production") {
    res.redirect("/saml2/login"); // Redirect to SAML login in production
  }else{
    console.log("here in dev session route");
  req.session.user = { username: "mep4741@rit.edu" };
  req.session.save();

  res.status(200).json({ status: "success", "session-data": req.session }); // Respond with session data
  console.log(req.session.user);
  }
});

// this is the steps that login will follow once SSO is complete
router.get("/production-login", function (req, res) {
  req.session.user = { username: "rit-email-from-sso" }; // TODO enter this email from SSO
  req.session.save();

  // is user new? redirect to edit profile
  const isUserNew = isNewUser.check("mep4741@rit.edu", "Maija", "Philip") // TODO:  fill these in with the SSO return 

  if (isUserNew) {
    res.redirect('/profile/edit')
    return;
  }
  
  // otherwise, redirect to dashboard
  res.redirect('/')
});

// GET /v1/session/logout
router.get("/logout", function (req, res) {
  if (req.session.user == null) {
    res.status(404).json({ error: `No session` });
    return;
  }
  req.session.destroy();
  res.status(200).json({ message: `Logged out` });
});

module.exports = router;
