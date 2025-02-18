let express = require("express");
const router = express.Router({ mergeParams: true });

const Error = require("../../business-logic-layer/public/errors.js");
const error = new Error();

const BusinessLogic = require("../../business-logic-layer/public/exports.js");
const business = new BusinessLogic();

const Sanitizer = require("../../business-logic-layer/public/sanitize.js");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware.js");
const sanitizer = new Sanitizer();


/**
 * ATTENDANCE TABLE ATTRIBUTES BASED ON DB
 * attendance_id, member_id, event_id, check_in, volunteer_hours
 */

/**
 * WHAT IS GIVEN TO USE IN DL "attendance.js"
 * 
 * createAttendance, - 
 * getAttendanceById,-
 * getAttendanceByMemberId -
 * getAttendanceByEventId, -
 * getAttendanceByMemberAndEvent -
 */


// POST /link/to/call/here/with/params
//createAttendance
/**
 * 
 */
router.post("/:param/link", async function (req, res) {

    // sanatize

    // check if params are valid!

    // send off to backend

    // check for errors that backend returned

    // return with appropriate status error and message
});

/**
 * getAttendanceById
 * Should not require authorization? A member should be able to see their own attendance for example but not the attendance of others (to be tweaked later) 
 */
router.get(
    "/:attendanceId", isAuthorizedHasSessionForAPI,
    async (req, res) => {
        let { attendanceId } = req.params;

        // Sanitize input
        attendanceId = sanitizer.sanitize(attendanceId);

        // Validate IDs
        if (isNaN(attendanceId)) {
            return res.status(400).json({ error: error.attendanceIdMustBeInteger });//TODO add errir
        }

        // Fetch data from business layer
        const event = await business.getAttendanceById(attendanceId); //TODO BL

        // Handle errors
        if (event.error && event.error !== error.noError) {
            return res.status(404).json({ error: event.error, attendanceId });
        }

        return res.status(200).json({ status: "success", data: event.data });
    }

);//getAttendanceById

/**
 * getAttendanceByMemberId
 */
router.get(
    "/attendance/:memberId", isAuthorizedHasSessionForAPI,
    async (req, res) => {
        let { memberId } = req.params;

        // Sanitize input
        memberId = sanitizer.sanitize(memberId);

        // Validate IDs
        if (isNaN(memberId)) {
            return res.status(400).json({ error: error.memberIdMustBeInteger });
        }

        // Fetch data from business layer
        const event = await business.getAttendanceById(attendanceId); //TODO BL

        // Handle errors
        if (event.error && event.error !== error.noError) {
            return res.status(404).json({ error: event.error, attendanceId });
        }

        return res.status(200).json({ status: "success", data: event.data });
    }

);//getAttendanceById


/**
 * getAttendanceByEventId
 */


/**
 * getAttendanceByMemberAndEvent
 * 
 * 
 */


module.exports = router;
