let express = require("express");
const router = express.Router();
const path = require("path");
const {
  isAuthorizedHasSessionForWebsite,
  isAdminOrEboardForOrg,
} = require("../../sessionMiddleware");

/*

SERVES UP THE FRONT END PAGES HERE:
https://api.rit.edu/

TO ADD A NEW PAGE:
1. add the page to the react router
2. build the react front end
3. add a new route below with the react router link, that links it to index.html 
   (the react router will handle it from there)


RESOURCES:
- https://stackoverflow.com/questions/48704772/how-to-serve-react-app-and-api-on-same-node-server
- https://stackoverflow.com/questions/16088824/serve-static-files-and-app-get-conflict-using-express-js 
*/

// GET index.html
router.get("/", isAuthorizedHasSessionForWebsite, function (req, res) {
  // console.log(req, res)
  res.sendFile(
    path.join(__dirname, "../../../frontend-layer/build", "index.html")
  );
});

// GET login  -- change for shibboleth
router.get("/login", function (req, res) {
  res.redirect("/saml2/login");
});

//Get metadata for SSO -- this is where metadata lives
router.get("/Shibboleth/Metadata", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../../metadata.xml")
  );
});

// GET profile
router.get("/profile", isAuthorizedHasSessionForWebsite, function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../../frontend-layer/build", "index.html")
  );
});

// GET edit profile
router.get(
  "/profile/edit",
  isAuthorizedHasSessionForWebsite,
  function (req, res) {
    res.sendFile(
      path.join(__dirname, "../../../frontend-layer/build", "index.html")
    );
  }
);

// GET org status
router.get(
  "/:orgId/status",
  isAuthorizedHasSessionForWebsite,
  function (req, res) {
    res.sendFile(
      path.join(__dirname, "../../../frontend-layer/build", "index.html")
    );
  }
);

// GET org events
router.get("/:orgId/events", isAuthorizedHasSessionForWebsite, function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../../frontend-layer/build", "index.html")
  );
});

// GET org settings
router.get("/:orgId/settings", isAdminOrEboardForOrg, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../../frontend-layer/build", "index.html")
  );
});

// GET org reports
router.get("/:orgId/reports", isAdminOrEboardForOrg, function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../../frontend-layer/build", "index.html")
  );
});

// GET create organization
router.get("/createOrg", isAdminOrEboardForOrg, function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../../frontend-layer/build", "index.html")
  );
});

module.exports = router;
