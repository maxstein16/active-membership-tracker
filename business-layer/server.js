"use strict";
// imports
const { MIN_30 } = require("./constants.js");

// Requires
require("dotenv").config(); // Load .env variables
const bodyParser = require("body-parser"); // parse the body of the request
const express = require("express"); // REST API
const session = require("express-session"); // sessions to log the user out
const logger = require("morgan"); // logging out the routes
const cors = require("cors"); // defines our cors policy (protects our api)
const cookieParser = require("cookie-parser"); // parse the cookies that our session uses
const path = require("path"); // finding the react pages
const fs = require("fs"); // file system for reading the certificates

let passport, defaultSamlStrategy, SP_CERT, https;

if (process.env.LOCATION === "production") {
  passport = require("passport"); // authentication for SSO/SHIBBOLETH
  //const SamlStrategy = require("passport-saml").Strategy; // SSO/SHIBBOLETH

  const { defaultSamlStrategyTemp, SP_CERTTemp } = require("./saml.js");
  defaultSamlStrategy = defaultSamlStrategyTemp;
  SP_CERT = SP_CERTTemp;
  https = require("https");
}
// create app
const app = express();

// Set env variables for prod
// if (process.env.LOCATION === "production") {
// }

// Import the database and models
const { sequelize } = require("./db.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(logger("dev"));
app.use(express.json());
app.enable("trust proxy");
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "../frontend-layer/build"), {
    index: false,
  })
);

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

const SITE_ROOT = "/saml2";
// check env for production or development
if (process.env.LOCATION === "production") {
  passport.use("saml", defaultSamlStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  });

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
}
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

// // Middleware to ensure the user is authenticated
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

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

let siteRoot;
// Handle routes that do not exist
if (process.env.LOCATION === "production") {
  siteRoot = express.Router();
  app.use(SITE_ROOT, siteRoot);
  app.set("trust proxy", true);

  siteRoot.get("/login", passport.authenticate("saml"));

  siteRoot.post(
    "/acs",
    bodyParser.urlencoded({ extended: false }),
    // might need route for unauthorized user
    passport.authenticate("saml", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  siteRoot.get("/metadata", (req, res) => {
    res.set("Content-Type", "text/xml");
    res
      .status(200)
      .send(
        defaultSamlStrategy.generateServiceProviderMetadata(SP_CERT, SP_CERT)
      );
  });

  app.get("*", (req, res) => {
    console.log("redirecting from where? ", req.originalUrl);
    console.log("Redirecting...");
    res.redirect("/");
  });
}
// DatabaseF
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
