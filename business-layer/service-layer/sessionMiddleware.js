const Error = require("../business-logic-layer/public/errors");
const error = new Error();

const {
  isEboardOrAdmin,
} = require("../business-logic-layer/public/hasCredentials");

function isAuthorizedHasSessionForAPI(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "No session, must log in to continue" });
  }
}

function isAuthorizedHasSessionForWebsite(req, res, next) {
  // console.log(req.user)
  if (req.isAuthenticated()) {
    // console.log(req.user.email)
    if (!req.session.user) {
      req.session.user = { username: req.user.email };
      req.session.save();
    }
    next();
  } else {
    res.redirect("/saml2/login");
  }
}

/**
 * Middleware to check if the user has admin or eboard privileges for an organization.
 * Redirects to the homepage if unauthorized.
 */
async function isAdminOrEboardForOrg(req, res, next) {
  const user = req.session.user;
  const orgId = req.params.orgId;

  if (req.isAuthenticated()) {
    if (!req.session.user) {
      req.session.user = { username: req.user.email };
      req.session.save();
    }
  } else {
    return res.redirect("/saml2/login");
  }

  const hasPrivilege = isEboardOrAdmin(user.username, orgId);
  if (!hasPrivilege) {
    res.status(401).json({ error: error.youDoNotHavePermission });
  }

  next();
}

module.exports = {
  isAuthorizedHasSessionForAPI,
  isAuthorizedHasSessionForWebsite,
  isAdminOrEboardForOrg,
};
