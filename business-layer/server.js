"use strict";
// imports
const { MIN_30 } = require("./constants.js");

// Requires
require("dotenv").config(); // Load .env variables
const express = require("express"); // REST API 
const session = require("express-session"); // sessions to log the user out
const logger = require("morgan"); // logging out the routes
const cors = require("cors"); // defines our cors policy (protects our api)
const cookieParser = require("cookie-parser"); // parse the cookies that our session uses
const path = require("path"); // finding the react pages

// create app
const app = express();

// Import the database and models
const { sequelize } = require("./db.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(logger("dev"));
app.use(express.json());
app.enable("trust proxy");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../frontend-layer/build"), { index: false }));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: MIN_30, httpOnly: true, secure: false }, // secure: true -> for production
  })
);

// CORS policy middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"], // Allow requests from frontend
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);
app.enable("trust proxy");
app.set("trust proxy", true);

// import routes
let serveFrontendRouter = require("./service-layer/routes/serveFrontendRoute.js");

let testRouter = require("./service-layer/routes/testRoute.js");
let sessionRouter = require("./service-layer/routes/sessionRoute.js");
let memberRouter = require("./service-layer/routes/memberRoute.js");
let organizationRouter = require("./service-layer/routes/organizationRouter.js");
let organizationMemberRouter = require("./service-layer/routes/organizationMemberRoute.js");
let organizationMembershipRouter = require("./service-layer/routes/organizationMembershipRouter.js");
let organizationReportsRouter = require("./service-layer/routes/organizationReportsRouter.js");
let organizationSettingsRouter = require("./service-layer/routes/organizationSettingsRoute.js");
// let organizationRecognitionsRouter = require("./service-layer/routes/organizationRecognitionRouter.js")
let eventsRouter = require("./service-layer/routes/eventsRoute.js");
let attendanceRouter = require("./service-layer/routes/attendanceRoute.js");
let csvUploadRouter = require("./service-layer/routes/csvUploadRoute.js");
let semesterRouter = require("./service-layer/routes/semesterRoute.js");
let emailRouter = require("./service-layer/routes/emailRoute.js");


// use the routes
app.use("/", serveFrontendRouter);

app.use("/v1/test", testRouter);
app.use("/v1/session", sessionRouter);
app.use("/v1/member", memberRouter);
app.use("/v1/organization", organizationRouter);
app.use("/v1/organization/:orgId/member", organizationMemberRouter);
app.use("/v1/organization/:orgId/membership", organizationMembershipRouter);
app.use("/v1/organization/:orgId/reports", organizationReportsRouter);
app.use("/v1/organization/:orgId/settings", organizationSettingsRouter);
// app.use("/v1/organization/:orgId/recognitions", organizationRecognitionsRouter);
app.use("/v1/organization/:orgId/events", eventsRouter);
app.use("/v1/attendance", attendanceRouter);
app.use("/v1/organization", csvUploadRouter);
app.use("/v1/semester", semesterRouter);
app.use("/v1/email", emailRouter);


// Handle routes that do not exist
app.get("*", (req, res) => {

  console.log("redirecting from where? ", req.originalUrl)
  console.log("Redirecting...")
  res.redirect('/')
});


// Database
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

