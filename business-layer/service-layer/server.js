'use strict';

const express = require('express');
const logger = require('morgan');
const path = require('path');

// create app 
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json()); // process JSON
app.use(express.urlencoded()); // processes form data
app.use(logger('dev')); // logs out the calls made in dev mode
app.use(express.static(path.join(__dirname, '../../frontend-layer/build'))); // shares front end statically

// import routes
let serveFrontendRouter = require("./routes/serveFrontendRoute.js");

let testRouter = require("./routes/testRoute.js");
let memberRouter = require("./routes/memberRoute.js");
let organizationRouter = require("./routes/organizationRouter.js");
let organizationMemberRouter = require("./routes/organizationMemberRoute.js");
let organizationReportsRouter = require("./routes/organizationReportsRouter.js");
let organizationReportsSettings = require("./routes/organizationSettingsRoute.js");


// use the routes
app.use("/", serveFrontendRouter);

app.use("/v1/test", testRouter);
app.use("/v1/member", memberRouter)
app.use("/v1/organization/:orgId", organizationRouter);
app.use("/v1/organization/:orgId/member", organizationMemberRouter);
app.use("/v1/organization/:orgId/reports", organizationReportsRouter);
app.use("/v1/organization/:orgId/settings", organizationReportsSettings);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});