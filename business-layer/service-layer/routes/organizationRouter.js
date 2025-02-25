const express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");
const hasCredentials = require("../../business-logic-layer/public/hasCredentials.js");

/**
 * Base route /v1/organization/
 * Returns error when no organization ID is provided for methods that require it
 */
router.all("/", isAuthorizedHasSessionForAPI, (req, res) => {
    // POST is allowed without an ID
    if (req.method === 'POST') {
        return handlePostOrganization(req, res);
    }
    
    // All other methods require an ID
    return res.status(400).json({
        status: "error",
        error: error.mustIncludeOrgId
    });
});

/**
 * GET /v1/organization/{orgId}
 * Retrieves specific organization data
 */
router.get("/:orgId", isAuthorizedHasSessionForAPI, async (req, res) => {
    try {
        const orgId = sanitizer.sanitize(req.params.orgId);

        if (isNaN(orgId)) {
            return res.status(400).json({ 
                status: "error", 
                error: error.organizationIdMustBeInteger 
            });
        }

        const orgInfo = await business.getSpecificOrgData(parseInt(orgId));
        
        if (!orgInfo || !orgInfo.data) {
            return res.status(404).json({
                status: "error",
                error: error.organizationNotFound
            });
        }

        return res.status(200).json({ 
            status: "success", 
            data: orgInfo.data 
        });
    } catch (err) {
        console.error("Error in GET /organization/:", err);
        return res.status(500).json({ 
            status: "error", 
            error: error.somethingWentWrong 
        });
    }
});

/**
 * Handler for creating new organization
 */
async function handlePostOrganization(req, res) {
    try {
        const orgData = {
            org_name: req.body.organization_name,
            org_description: req.body.organization_desc,
            org_category: req.body.organization_category,
            org_contact_email: req.body.contact_email,
            org_phone_number: req.body.phone_number,
            organization_abbreviation: req.body.organization_abbreviation,
            organization_color: req.body.organization_color,
            active_membership_threshold: req.body.active_membership_threshold
        };

        // Validate required fields
        const requiredFields = [
            'org_name',
            'organization_abbreviation',
            'org_description',
            'organization_color',
            'active_membership_threshold'
        ];

        const missingFields = requiredFields.filter(field => !orgData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: "error",
                error: error.mustHaveAllFieldsAddOrg,
                missingFields
            });
        }

        const result = await business.createOrganization(orgData);

        if (result.error) {
            return res.status(400).json({
                status: "error",
                error: result.error
            });
        }

        return res.status(201).json({
            status: "success",
            data: result.data
        });
    } catch (err) {
        console.error("Error in POST /organization/:", err);
        return res.status(500).json({
            status: "error",
            error: error.somethingWentWrong
        });
    }
}

/**
 * PUT /v1/organization/{orgId}
 * Updates an existing organization
 */
router.put("/:orgId", isAuthorizedHasSessionForAPI, async (req, res) => {
    try {
        const orgId = sanitizer.sanitize(req.params.orgId);

        if (isNaN(orgId)) {
            return res.status(400).json({
                status: "error",
                error: error.organizationIdMustBeInteger
            });
        }

        const orgData = {
            org_name: req.body.organization_name,
            org_description: req.body.organization_description,
            org_category: req.body.organization_category,
            org_contact_email: req.body.contact_email,
            org_phone_number: req.body.phone_number,
            organization_abbreviation: req.body.organization_abbreviation,
            organization_color: req.body.organization_color,
            active_membership_threshold: req.body.active_membership_threshold
        };

        // Remove undefined fields
        Object.keys(orgData).forEach(key => 
            orgData[key] === undefined && delete orgData[key]
        );

        if (Object.keys(orgData).length === 0) {
            return res.status(400).json({
                status: "error",
                error: error.mustHaveAtLeastOneFieldToEditOrg
            });
        }

        const result = await business.updateOrganization(parseInt(orgId), orgData);

        if (result.error) {
            return res.status(404).json({
                status: "error",
                error: result.error
            });
        }

        return res.status(200).json({
            status: "success",
            data: result.data
        });
    } catch (err) {
        console.error("Error in PUT /organization/:", err);
        return res.status(500).json({
            status: "error",
            error: error.somethingWentWrong
        });
    }
});

module.exports = router;