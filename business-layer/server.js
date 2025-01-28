"use strict";
// imports
const { MIN_30 } = require("../constants.js");

// Requires
require("dotenv").config(); // Load .env variables
const express = require("express"); // REST API 
const session = require("express-session"); // sessions to log the user out
const logger = require("morgan"); // logging out the routes
const path = require("path"); // finding the react pages

// create app
const app = express();

// Import the database and models
const { sequelize } = require("./db.js");

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../frontend-layer/build")));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { secure: true, maxAge: MIN_30, sameSite: "none" },
  })
);


// import routes
let serveFrontendRouter = require("./service-layer/routes/serveFrontendRoute.js");

let testRouter = require("./service-layer/routes/testRoute.js");
let memberRouter = require("./service-layer/routes/memberRoute.js");
let organizationRouter = require("./service-layer/routes/organizationRouter.js");
let organizationMemberRouter = require("./service-layer/routes/organizationMemberRoute.js");
let organizationReportsRouter = require("./service-layer/routes/organizationReportsRouter.js");
let organizationReportsSettings = require("./service-layer/routes/organizationSettingsRoute.js");

// use the routes
app.use("/", serveFrontendRouter);

app.use("/v1/test", testRouter);
app.use("/v1/member", memberRouter);
app.use("/v1/organization/:orgId", organizationRouter);
app.use("/v1/organization/:orgId/member", organizationMemberRouter);
app.use("/v1/organization/:orgId/reports", organizationReportsRouter);
app.use("/v1/organization/:orgId/settings", organizationReportsSettings);

const ensureDatabaseExists = async () => {
  const dbName = "membertracker";

  // Use the default Sequelize connection without specifying a database
  const connection = new (require("sequelize"))(
    "",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mariadb",
      logging: false,
    }
  );

  try {
    // Check if the database exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' is ready.`);
  } catch (err) {
    console.error("Error ensuring database exists:", err.message);
    throw err;
  } finally {
    await connection.close(); // Close the temporary connection
  }
};

// Start the server
const PORT = process.env.PORT || 8080;
ensureDatabaseExists()
  .then(() => {
    return sequelize.authenticate();
  })
  .then(() => {
    console.log("Database connected successfully.");
    return sequelize.sync(); // Sync models with the database
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to start the application:", err);
  });
