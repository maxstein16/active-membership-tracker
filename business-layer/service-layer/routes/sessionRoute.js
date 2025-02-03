let express = require("express");
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
  req.session.user = { username: "enter-rit-username" };
  req.session.save();

  req.session.user = res
    .status(200)
    .json({ status: "success", "session-data": req.session });
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
