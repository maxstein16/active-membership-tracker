const express = require("express");
const passport = require("passport");
const router = express.Router();

// Define routes for SSO
router.get(
  "/login",
  passport.authenticate("saml", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post(
  "/login/callback",
  passport.authenticate("saml", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;