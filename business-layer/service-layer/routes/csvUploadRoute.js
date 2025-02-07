const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const path = require("path");

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware.js");

// Configure Multer for file uploads
const upload = multer({
    dest: "uploads/", // Temporary storage location
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== ".csv") {
            return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    },
});

/**
 * POST v1/organizations/{orgId}/upload-csv
 * Upload and process a CSV file.
 */
router.post(
    "v1/organizations/:orgId/upload-csv",
    isAuthorizedHasSessionForAPI,
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
            // Process the uploaded file in business logic
            const result = await business.processCSVUpload(orgId, req.file.path);

            if (result.error && result.error !== error.noError) {
                return res.status(500).json({ error: result.error, orgId });
            }

            return res.status(200).json({
                status: "success",
                message: "CSV file processed successfully",
                data: result.data,
            });
        } catch (err) {
            return res.status(500).json({ error: "Failed to process CSV file" });
        }
    }
);

module.exports = router;
