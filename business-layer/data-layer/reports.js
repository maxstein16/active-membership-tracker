const { Event } = require("../db");

async function getMeetingDetails(orgId, meetingId) {
  try {
    const event = await Event.findOne({
      where: { 
        event_id: meetingId,
        organization_id: orgId
      }
    });
    return event;
  } catch (err) {
    console.error("Error in getMeetingDetails:", err);
    throw err;
  }
}

module.exports = {
  getMeetingDetails
};