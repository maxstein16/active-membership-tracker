const express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware.js");
const sanitizer = new Sanitizer();

/**
 * ATTENDANCE TABLE ATTRIBUTES (Based on DB):
 * - attendance_id
 * - member_id
 * - event_id
 * - check_in
 * - volunteer_hours
 */

/**
 * DATA LAYER FUNCTIONS (from "attendance.js")
 * - createAttendance
 * - getAttendanceById
 * - getAttendanceByMemberId
 * - getAttendanceByEventId
 * - getAttendanceByMemberAndEvent
 */

// POST /link/to/call/here/with/params (Create Attendance)
router.post("/:param/link", async (req, res) => {
    // TODO: Implement sanitation, validation, business logic, and error handling.
});

// GET /attendance/:attendanceId (Retrieve attendance by ID)
router.get("/:attendanceId", isAuthorizedHasSessionForAPI, async (req, res) => {
    let { attendanceId } = req.params;
    attendanceId = sanitizer.sanitize(attendanceId);

    if (isNaN(attendanceId)) {
        return res.status(400).json({ error: error.attendanceIdMustBeInteger });
    }

    const attendance = await business.getAttendanceById(attendanceId);
    if (attendance.error && attendance.error !== error.noError) {
        return res.status(404).json({ error: attendance.error, attendanceId });
    }

    return res.status(200).json({ status: "success", data: attendance.data });
});

// GET /attendance/member/:memberId (Retrieve attendance by Member ID)
router.get("/attendance/member/:memberId", isAuthorizedHasSessionForAPI, async (req, res) => {
    let { memberId } = req.params;
    memberId = sanitizer.sanitize(memberId);

    if (isNaN(memberId)) {
        return res.status(400).json({ error: error.memberIdMustBeInteger });
    }

    const attendance = await business.getAttendanceByMemberId(memberId);
    if (attendance.error && attendance.error !== error.noError) {
        return res.status(404).json({ error: attendance.error, memberId });
    }

    return res.status(200).json({ status: "success", data: attendance.data });
});

// GET /attendance/event/:eventId (Retrieve attendance by Event ID)
router.get("/attendance/event/:eventId", isAuthorizedHasSessionForAPI, async (req, res) => {
    let { eventId } = req.params;
    eventId = sanitizer.sanitize(eventId);

    if (isNaN(eventId)) {
        return res.status(400).json({ error: error.eventIdMustBeInteger });
    }

    const attendance = await business.getAttendanceByEventId(eventId);
    if (attendance.error && attendance.error !== error.noError) {
        return res.status(404).json({ error: attendance.error, eventId });
    }

    return res.status(200).json({ status: "success", data: attendance.data });
});

// GET /attendance/member/:memberId/event/:eventId (Retrieve attendance by Member & Event ID)
router.get("/attendance/member/:memberId/event/:eventId", isAuthorizedHasSessionForAPI, async (req, res) => {
    let { memberId, eventId } = req.params;
    memberId = sanitizer.sanitize(memberId);
    eventId = sanitizer.sanitize(eventId);

    if (isNaN(memberId)) {
        return res.status(400).json({ error: error.memberIdMustBeInteger });
    }
    if (isNaN(eventId)) {
        return res.status(400).json({ error: error.eventIdMustBeInteger });
    }

    const attendance = await business.getAttendanceByMemberAndEvent(memberId, eventId);
    if (attendance.error && attendance.error !== error.noError) {
        return res.status(404).json({ error: attendance.error, memberId, eventId });
    }

    return res.status(200).json({ status: "success", data: attendance.data });
});

module.exports = router;
