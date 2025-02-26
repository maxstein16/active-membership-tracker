const express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const sanitizer = new Sanitizer();

const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");

/**
 * Get members by role in an organization for a specific semester
 * GET /v1/organization/{orgId}/membership/{role}
 */
router.get(
    "/:role",
    isAuthorizedHasSessionForAPI,
    async function (req, res) {
        try {
            const orgId = sanitizer.sanitize(req.params.orgId);
            const role = sanitizer.sanitize(req.params.role);
            const semesterId = sanitizer.sanitize(req.query.semesterId);

            // Input validation
            const validationErrors = validateInputs({ orgId, role, semesterId });
            if (validationErrors) {
                return res.status(400).json({ error: validationErrors });
            }

            const result = await business.getMembershipRoleInfoInOrganization(
                parseInt(orgId),
                parseInt(role),
                parseInt(semesterId)
            );

            if (result.error && result.error !== error.noError) {
                return res.status(404).json({ error: result.error });
            }

            return res.status(200).json({
                status: "success",
                data: result.data
            });
        } catch (err) {
            console.error("Error in GET /:role:", err);
            return res.status(500).json({ error: error.somethingWentWrong });
        }
    }
);

/**
 * Get all members in an organization for a specific semester
 * GET /v1/organization/{orgId}/membership/
 */
router.get(
    "/",
    isAuthorizedHasSessionForAPI,
    async function (req, res) {
        try {
            const orgId = sanitizer.sanitize(req.params.orgId);
            const semesterId = sanitizer.sanitize(req.query.semesterId);

            // Input validation
            const validationErrors = validateInputs({ orgId, semesterId });
            if (validationErrors) {
                return res.status(400).json({ error: validationErrors });
            }

            const result = await business.getAllMembershipsInOrganization(
                parseInt(orgId),
                parseInt(semesterId)
            );

            if (result.error && result.error !== error.noError) {
                return res.status(404).json({ error: result.error });
            }

            return res.status(200).json({
                status: "success",
                data: result.data
            });
        } catch (err) {
            console.error("Error in GET /:", err);
            return res.status(500).json({ error: error.somethingWentWrong });
        }
    }
);

/**
 * Validate input parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object|null} Error object if validation fails, null otherwise
 */
function validateInputs(params) {
    const { orgId, role, semesterId } = params;

    if (isNaN(orgId)) {
        return error.organizationIdMustBeInteger;
    }

    if (role !== undefined && isNaN(role)) {
        return error.roleMustBeAnInteger;
    }

    if (semesterId === undefined) {
        return error.semesterIdRequired;
    }

    if (isNaN(semesterId)) {
        return error.semesterIdMustBeInteger;
    }

    return null;
}

module.exports = router;