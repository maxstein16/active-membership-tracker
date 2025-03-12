const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const path = require("path");

const ErrorMessages = require("../../business-logic-layer/public/errors.js");
const error = new ErrorMessages();

const BusinessLogic = require("../../business-logic-layer/public/csvUploadProcessing.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();
const {
  isAuthorizedHasSessionForAPI,
  isAdminOrEboardForOrg,
} = require("../sessionMiddleware.js");

// Configure Multer for file uploads
const upload = multer({
  dest: "uploads/",
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

    // Validate organization ID
    if (isNaN(orgId)) {
      return res.status(400).json({ error: error.organizationIdMustBeInteger });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    try {
      // Process the uploaded file using business logic
      const result = await business.processCSV(req.file.path);

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
