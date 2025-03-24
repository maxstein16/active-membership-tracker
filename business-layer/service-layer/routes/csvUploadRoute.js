const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Add this line to require 'fs'

const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();

const BusinessLogic = require("../../business-logic-layer/csvUploadProcessing.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();
const {
  isAuthorizedHasSessionForAPI,
  isAdminOrEboardForOrg,
} = require("../sessionMiddleware.js");
const { compareSync } = require("bcrypt");

// Define the upload directory
const uploadDir = path.join(__dirname, "uploads");

// Check if the folder exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    console.log("Uploads directory not found. Creating...");
    fs.mkdirSync(uploadDir);
    console.log("Uploads directory created:", uploadDir);  // Log the path where the folder was created
} else {
    console.log("Uploads directory already exists:", uploadDir);  // Log if it already exists
}

// Configure Multer for file uploads
const upload = multer({
  dest: uploadDir, // Use the correct upload directory here
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/upload-csv",
  isAdminOrEboardForOrg,
  upload.single("file"),
  async (req, res) => {
    let orgId = req.params.orgId;
    orgId = sanitizer.sanitize(orgId);

    let eventId = req.params.eventId;
    eventId = sanitizer.sanitize(eventId)
    
    // Validate organization ID
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
        } else {
            console.log("Your org id is valid");
    }

        console.log("now we check the request file")
        console.log("these are the params " + req.file)

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
        } else {
            console.log("Properly uploaded CSV file")
    }

    try {
            console.log("Trying to await processCSV, the file path is " + req.file.path)
      // Process the uploaded file using business logic
      const result = await business.processCSV(req.file.path, eventId, orgId);

      if (result.error) {
        // Handle the specific error from business logic
        return res
          .status(500)
          .json({ error: result.error || error.csvProcessingFailed });
      }

      return res.status(200).json({
        status: "success",
        message: "CSV file processed successfully",
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: error.genericProcessingError });
    }
  }
);

module.exports = router;
