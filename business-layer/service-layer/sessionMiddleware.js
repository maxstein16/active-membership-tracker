function isAuthorizedHasSessionForAPI(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res.status(401).json({ error: "No session, must login to continue" });
    }
}

function isAuthorizedHasSessionForWebsite(req, res, next) {
    console.log("here2", req.session.user)
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    isAuthorizedHasSessionForAPI,
    isAuthorizedHasSessionForWebsite
  };