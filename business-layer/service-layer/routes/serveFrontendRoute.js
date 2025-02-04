let express = require("express");
const router = express.Router();
const path = require('path');

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
router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../../frontend-layer/build', 'index.html'));
});

// GET login
router.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, '../../../frontend-layer/build', 'index.html'));
});

// GET profile
router.get("/profile", function (req, res) {
    res.sendFile(path.join(__dirname, '../../../frontend-layer/build', 'index.html'));
});

// GET edit profile
router.get("/profile/edit", function (req, res) {
    res.sendFile(path.join(__dirname, '../../../frontend-layer/build', 'index.html'));
});

// GET admin
router.get("/admin", function (req, res) {
    res.sendFile(path.join(__dirname, '../../../frontend-layer/build', 'index.html'));
});

module.exports = router;
