'use strict';

const express = require('express');
const logger = require('morgan');
const path = require('path');

// create app 
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, '../../frontend-layer/build')));

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
// https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, '../../frontend-layer/build', 'index.html'));
    }
});
app.use(express.static(path.join(__dirname, '../../frontend-layer/build')));

// hello route
// app.use((req, res) => {
//     res.status(200).json({ message: "Hello Tester" });
// });

// import routes
let testRouter = require("./routes/testRoute.js");
let memberRouter = require("./routes/memberRoute.js");
let organizationRouter = require("./routes/organizationRouter.js");
let organizationMemberRouter = require("./routes/organizationMemberRoute.js");
let organizationReportsRouter = require("./routes/organizationReportsRouter.js");


// use the routes
app.use("/v1/test", testRouter);
app.use("/v1/member", memberRouter)
app.use("/v1/organization/:orgId", organizationRouter);
app.use("/v1/organization/:orgId/member", organizationMemberRouter);
app.use("/v1/organization/:orgId/reports", organizationReportsRouter);



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});