/**
 * Generates an Annual Report email.
 * @param {string} orgAbr - Organization abbreviation
 * @param {number} meetingNum - Number of meetings
 * @param {number} eventNum - Number of events
 * @param {number} volunteerNum - Number of volunteer events
 * @param {number} newActiveMemberNum - New active members
 * @param {number} newMembersNum - New total members
 */
function annualReportEmail(orgAbr, meetingNum, eventNum, volunteerNum, newActiveMemberNum, newMembersNum) {
    return {
      subject: `${orgAbr} Annual Report`,
      body: `
        <p>Hello members!</p>
        <p>We are so proud to tell you that this year we hosted <strong>${meetingNum} meetings</strong>, 
        <strong>${eventNum} events</strong>, and <strong>${volunteerNum} volunteer events</strong>.</p>
        <p>We have also gained <strong>${newActiveMemberNum} active members</strong> and <strong>${newMembersNum} new members</strong>.</p>
        <p>Thank you for being with us this year!</p>
        <p>- ${orgAbr}</p>
      `,
    };
  }
  
// generates a Semester Report email.
function semesterReportEmail(orgAbr, meetingNum, eventNum, volunteerNum, newActiveMemberNum, newMembersNum) {
    return {
        subject: `${orgAbr} Semester Report`,
        body: `
        <p>Hello members!</p>
        <p>We are so proud to tell you that this semester we hosted <strong>${meetingNum} meetings</strong>, 
        <strong>${eventNum} events</strong>, and <strong>${volunteerNum} volunteer events</strong>.</p>
        <p>We have also gained <strong>${newActiveMemberNum} active members</strong> and <strong>${newMembersNum} new members</strong>.</p>
        <p>Thank you for being with us this semester!</p>
        <p>- ${orgAbr}</p>
        `,
    };
}
  
// generates a Status Report email.
function statusReportEmail(orgAbr, memberName, meetingNum, volunteerNum, eventsNum, isActive, numPointsAway, percent) {
    let membershipMessage = isActive
        ? "<strong>Congrats! You are an active member!</strong>"
        : numPointsAway !== null
        ? `<strong>You are ${numPointsAway} points away from active membership!</strong>`
        : `<strong>You are ${percent}% of the way to an active membership</strong>`;

    return {
        subject: `Your ${orgAbr} Status Report`,
        body: `
        <p>Hello ${memberName}!</p>
            <p>Here is your breakdown for this status period:</p>
                <ul>
                    <li><strong>Meetings Attended:</strong> ${meetingNum}</li>
                    <li><strong>Volunteer Events Attended:</strong> ${volunteerNum}</li>
                    <li><strong>Social Events Attended:</strong> ${eventsNum}</li>
                </ul>
                <p>${membershipMessage}</p>
            <p>Thank you for your attendance!</p>
        <p>- ${orgAbr}</p>
        `,
    };
}

// generates an Active Membership Achievement email.
function activeMembershipEmail(memberName, orgName, orgAbr) {
return {
    subject: `You have gained your ${orgAbr} Active Membership status!`,
    body: `
    <p>Congratulations ${memberName}!</p>
        <p>You have met the requirements to be an Active Member of <strong>${orgName}</strong>.</p>
        <p>Thank you for being such a strong part of ${orgAbr}!</p>
    <p>- ${orgName} Team</p>
    `,
};
}

module.exports = {
annualReportEmail,
semesterReportEmail,
statusReportEmail,
activeMembershipEmail,
};
