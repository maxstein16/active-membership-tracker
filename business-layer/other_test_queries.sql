DROP DATABASE if exists membertracker;

USE membertracker;

-- INSERT INTO Organization (organization_name, organization_description, organization_color, organization_abbreviation, organization_threshold) 
-- VALUES 
-- ('Tech Club', 'A club for tech enthusiasts', 'blue', 'TC', 10),
-- ('Art Society', 'A group for artists and designers', 'red', 'AS', 5);

-- -- console.log("created orgs");

-- INSERT INTO Semester (semester_id, semester_name, academic_year, start_date, end_date) 
-- VALUES 
-- (1123, '2024 FALL TEST', '2024-2025', '2024-08-14', '2024-12-16'),
-- (1124, '2025 SPRING TEST', '2024-2025', '2025-01-14', '2025-05-02');

-- console.log("created semesters");

-- INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status) 
-- VALUES 
-- ('John Doe', 'johndoe@university.edu', 'john.doe@gmail.com', '123-456-7890', '2025-05-15', 'M', 'Computer Science', 'Male', 'White', 'undergraduate'),
-- ('Jane Smith', 'janesmith@university.edu', 'jane.smith@gmail.com', '987-654-3210', '2026-05-20', 'S', 'Fine Arts', 'Female', 'Asian', 'undergraduate'),
-- ('Alice Johnson', 'alicej@university.com', 'alicej.personal@email.com', '555-555-1234','2024-12-10', 'S', 'Psychology', 'Female', 'African American', 'undergraduate'),
-- ('Maria Lee', 'marialee@university.com', 'marialee.personal@email.com', '555-321-9876','2027-05-25', 'M', 'Chemistry', 'Female', 'White', 'undergraduate'),
-- ('Charlie Davis', 'charliedavis@university.com', 'charliedavis.personal@email.com', '555-234-6789', '2024-11-30', 'L', 'Business Administration', 'Male', 'Native American', 'graduate'),
-- ('Emily Wilson', 'emilywilson@university.com', 'emilywilson.personal@email.com', '555-876-5432', '2025-03-12', 'S', 'English Literature', 'Female', 'Middle Eastern', 'undergraduate'),
-- ('David Martinez', 'davidmartinez@university.com', 'davidmartinez.personal@email.com', '555-432-7654','2026-06-30', 'M', 'Physics', 'Male', 'Latino', 'graduate'),
-- ('Sophia Harris', 'sophiaharris@university.com', 'sophiaharris.personal@email.com', '555-987-1234','2025-12-15', 'L', 'Art History', 'Female', 'Caucasian', 'graduate');

-- console.log("created members");
--  membership_role: 2,
--       member_id: member.member_id,
--       organization_id: org1.organization_id,
--       semester_id: sem1.semester_id,
--       membership_points: randomNum,
--       active_member: randomNum >= 42,
--       active_semesters: 1,

-- INSERT INTO Membership (membership_id, member_id, organization_id, semester_id, membership_role, membership_points, active_member, active_semesters) 
-- VALUES 
-- (1, 1, 1, 1123, 0, 15, TRUE, 2),
-- (2, 2, 2, 1123, 0, 5, FALSE, 0),
-- (3, 4, 2, 1123, 1, 15, TRUE, 2),
-- (4, 3, 1, 1124, 0, 15, FALSE, 2),
-- (5, 6, 1, 1124, 0, 25, TRUE, 3);
-- console.log("created membership");

-- INSERT INTO EmailSettings (organization_id, current_status, annual_report, semester_report, membership_achieved) 
-- VALUES 
-- (1, TRUE, FALSE, TRUE, FALSE),
-- (2, FALSE, FALSE, TRUE, TRUE);

-- console.log("created emailsettings");

INSERT INTO MembershipRequirement (organization_id, meeting_type, frequency, amount_type, amount, requirement_scope) 
VALUES 
(1, 'Meeting', 'Semesterly', 'points', 4, 'semesterly'),
(1, 'Event', 'Yearly', 'points', 2, 'annually'),
(1, 'Volunteer', 'Semesterly', 'percentage', 50, 'semesterly'),
(2, 'Meeting', 'Yearly', 'points', 1, 'annually'),
(2, 'Event', 'Semesterly', 'percentage', 25, 'semesterly'),
(2, 'Volunteer', 'Semesterly', 'percentage', 50, 'semesterly');

-- console.log("created membership requirement");

INSERT INTO Event (organization_id, event_name, event_start, event_end, event_location, event_description, event_type) VALUES
(1, 'WiC General Meeting', '2025-02-05 18:00:00', '2025-02-05 19:30:00', 'GOL 1400', 'An overview of upcoming events and initiatives.', 'general_meeting'),
(1, 'WiC Volunteer Day', '2025-03-10 10:00:00', '2025-03-10 14:00:00', 'Local Community Center', 'Helping out at the community center with tech workshops.', 'volunteer'),
(1, 'WiC Social Night', '2024-04-15 19:00:00', '2024-04-15 22:00:00', `Java's Café`, 'A night of networking, games, and fun!', 'social'),
(2, 'COMS Workshop: Resume Building', '2025-02-12 17:30:00', '2025-02-12 19:00:00', 'GOL 2250', 'Learn how to craft a compelling resume with industry professionals.', 'workshop'),
(2, 'COMS Charity Fundraiser', '2024-03-20 18:00:00', '2024-03-20 21:00:00', 'RIT Ballroom', 'A night of fundraising for a local cause with guest speakers.', 'fundraiser'),
(2, 'COMS Committee Brainstorming', '2024-04-10 16:00:00', '2024-04-10 18:00:00', 'GOL 3000', 'Collaborate and plan initiatives for the next semester.', 'committee');

-- console.log("created event")

INSERT INTO Attendance (member_id, event_id, check_in) VALUES
(1, 1, '2025-02-05 18:01:00'),
(2, 1, '2025-02-05 18:02:00'),

(3, 2, '2025-03-10 12:00:00'),
(4, 2, '2025-03-10 10:01:00'),

(5, 3, '2024-04-15 19:01:00'),
(6, 3, '2024-04-15 20:00:00'),
(7, 3, '2024-04-15 21:00:00'),

-- coms events
(1, 4, '2025-02-12 18:00:00'),
(2, 4, '2025-02-12 18:30:00'),

(3, 5, '2024-03-20 18:01:00'),
(4, 5, '2024-03-20 18:02:00'),

(5, 6, '2024-04-10 16:01:00'),
(6, 6, '2024-04-10 16:30:00');

-- console.log("created attendance");