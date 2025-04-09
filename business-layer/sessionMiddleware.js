const Error = require("./business-logic-layer/public/errors");
const error = new Error();

const {
  isEboardOrAdmin,
} = require("./business-logic-layer/public/hasCredentials");

function isAuthorizedHasSessionForAPI(req, res, next) {
  console.log('here')
  if (process.env.LOCATION === "production") {
    console.log('here PROD')
    if (req.isAuthenticated()) {
      next();
      return
    } else {
      res.status(401).json({ error: "No session, must log in to continue" });
      return;
    }
  } else {
    console.log('here DEV')
    if (req.session.user) {
      console.log('here on our way')
      next();
      return;
    } else {
      console.log('not logged in')
      res.status(401).json({ error: "No session, must log in to continue" });
      return;
    }
  }
}

function isAuthorizedHasSessionForWebsite(req, res, next) {
  console.log('here for web')
  if (process.env.LOCATION === "production") {
    console.log('here for web production')
    // console.log(req.user)
    if (req.isAuthenticated()) {
      // console.log(req.user.email)
      if (!req.session.user) {
        req.session.user = { username: req.user.email };
        req.session.save();
      }
      next();
      return
    } else {
      res.redirect("/saml2/login");
      return;
    }
  } else {
    console.log('here for web DEV')
    if (req.session.user) {
      console.log('here for web, move on')
      next();
      return;
    } else {
      console.log('here for web redirect')
      res.redirect("/login");
      return;
    }
  }
}

/**
 * Middleware to check if the user has admin or eboard privileges for an organization.
 * Redirects to the homepage if unauthorized.
 */
function isAdminOrEboardForOrg(req, res, next) {
  console.log('here is admin or eboard')
  const user = req.session.user;
  const orgId = req.params.orgId;

  if (process.env.LOCATION === "production") {
    console.log('here is admin or eboard, PROD')
    if (req.isAuthenticated()) {
      if (!req.session.user) {
        req.session.user = { username: req.user.email };
        req.session.save();
      }
    } else {
      return res.redirect("/saml2/login");
    }
  } else {
    console.log('here is admin or eboard, DEV')
    if (!req.session.user) {
      console.log('here is admin or eboard, redirect')
      res.redirect("/login");
      return;
    }
  }
  
  console.log('here is admin or eboard, last part')
  isEboardOrAdmin(user.username, orgId).then(hasPrivilege => {
    console.log('fixed now this', hasPrivilege)
    if (!hasPrivilege) {
      console.log('here is admin or eboard, not privleedge redicet')
      res.status(401).json({ error: error.youDoNotHavePermission });
      return;
    }
  
    console.log('here is admin or eboard, continue priviledge')
    next();
    return
  });
  
}

module.exports = {
  isAuthorizedHasSessionForAPI,
  isAuthorizedHasSessionForWebsite,
  isAdminOrEboardForOrg,
};
