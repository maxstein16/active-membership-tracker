const {
  isEboardOrAdmin,
} = require("../business-logic-layer/public/hasCredentials");

function isAuthorizedHasSessionForAPI(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "No session, must log in to continue" });
  }
}

function isAuthorizedHasSessionForWebsite(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

/**
 * Middleware to check if the user has admin or eboard privileges for an organization.
 * Redirects to the homepage if unauthorized.
 */
async function isAdminOrEboardForOrg(req, res, next) {
  const user = req.session.user;
  const orgId = req.params.orgId;

  if (!user) {
    return res.redirect("/login");
  }

  const hasPrivilege = isEboardOrAdmin(user.username, orgId);
  if (!hasPrivilege) {
    return res.redirect("/"); // Redirect unauthorized users to homepage
  }

  next();
}

module.exports = {
  isAuthorizedHasSessionForAPI,
  isAuthorizedHasSessionForWebsite,
  isAdminOrEboardForOrg,
};
