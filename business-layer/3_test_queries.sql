-- ===================================
-- Drop existing database and recreate
-- ===================================
-- CREATE DATABASE membertracker;
USE membertracker;

-- ==============================
-- Insert Test Data
-- ==============================

-- Insert into Organization
INSERT INTO Organization (organization_name, organization_description, organization_color, organization_abbreviation, organization_threshold, createdAt, updatedAt) 
VALUES 
('Tech Club', 'A club for tech enthusiasts', 'blue', 'TC', 10, '2024-03-01', '2024-03-01'),
('Art Society', 'A group for artists and designers', 'red', 'AS', 5, '2024-03-01', '2024-03-01');

-- -- Insert into Semester
INSERT INTO Semester (semester_id, semester_name, academic_year, start_date, end_date, createdAt, updatedAt) 
VALUES 
(2241, 'Spring 2024', '2023-2024', '2024-01-15', '2024-05-10', '2024-03-01', '2024-03-01'),
(2245, 'Fall 2024', '2024-2025', '2024-08-20', '2024-12-15', '2024-03-01', '2024-03-01');


-- 2 Insert into Semester
-- INSERT INTO Semester (semester_id, semester_name, academic_year, start_date, end_date, createdAt, updatedAt) 
-- VALUES 
-- (2241, 'Spring 2024', '2023-2024', '2024-01-15', '2024-05-10', '2024-03-01', '2024-03-01'),
-- (2245, 'Fall 2024', '2024-2025', '2024-08-20', '2024-12-15', '2024-03-01', '2024-03-01');


-- -- Insert into Member
INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status, createdAt, updatedAt) 
VALUES 
('John Doe', 'johndoe@university.edu', 'john.doe@gmail.com', '123-456-7890', '2025-05-15', 'M', 'Computer Science', 'Male', 'White', 'undergraduate', '2024-03-01', '2024-03-01'),
('Jane Smith', 'janesmith@university.edu', 'jane.smith@gmail.com', '987-654-3210', '2026-05-20', 'S', 'Fine Arts', 'Female', 'Asian', 'undergraduate', '2024-03-01', '2024-03-01'),


INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status, createdAt, updatedAt) 
VALUES 
('Alice Johnson', 'alicej@university.com', 'alicej.personal@email.com', '555-555-1234','2024-12-10', 'S', 'Psychology', 'Female', 'African American', 'undergraduate', '2024-01-01', '2024-03-01'),
('Maria Lee', 'marialee@university.com', 'marialee.personal@email.com', '555-321-9876','2027-05-25', 'M', 'Chemistry', 'Female', 'White', 'undergraduate', '2023-03-11', '2024-02-01');


INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status, createdAt, updatedAt) 
VALUES 
('Charlie Davis', 'charliedavis@university.com', 'charliedavis.personal@email.com', '555-234-6789', '2024-11-30', 'L', 'Business Administration', 'Male', 'Native American', 'graduate', '2021-12-01', '2024-01-01'),
('Emily Wilson', 'emilywilson@university.com', 'emilywilson.personal@email.com', '555-876-5432', '2025-03-12', 'S', 'English Literature', 'Female', 'Middle Eastern', 'undergraduate', '2022-01-15', '2025-02-10'),
('David Martinez', 'davidmartinez@university.com', 'davidmartinez.personal@email.com', '555-432-7654','2026-06-30', 'M', 'Physics', 'Male', 'Latino', 'graduate', '2025-02-01', '2025-02-11');

INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status, createdAt, updatedAt) 
VALUES 
('Sophia Harris', 'sophiaharris@university.com', 'sophiaharris.personal@email.com', '555-987-1234','2025-12-15', 'L', 'Art History', 'Female', 'Caucasian', 'graduate', '2024-07-08', '2024-10-11');

-- UPDATE Customers
-- SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
-- WHERE CustomerID = 1;

UPDATE Member SET createdAt = '2025-01-12 00:00:00' WHERE member_id = 10;

-- membership_id INT AUTO_INCREMENT, -- Unique ID for each membership record
--   member_id INT, -- Member associated with this membership
--   organization_id INT, -- Organization the member belongs to
--   semester_id INT, -- Semester in which this membership is valid
--   membership_role INT, -- Role within the organization (e.g., 0=Member, 1=E-Board, 2=Admin)
--   membership_points INT DEFAULT 0, -- Points earned in the organization
--   active_member BOOLEAN DEFAULT FALSE, -- Whether the member is currently active
--   active_semesters INT DEFAULT 0, -- Total number of active semesters

-- Insert into Membership
INSERT INTO Membership (membership_id, member_id, organization_id, semester_id, membership_role, membership_points, active_member, active_semesters, createdAt, updatedAt) 
VALUES 
(1, 1, 1, 2241, 0, 15, TRUE, 2, '2024-03-01', '2024-03-01'),
(2, 2, 2, 2241, 0, 5, FALSE, 0, '2024-03-01', '2024-03-01'),


INSERT INTO Membership (membership_id, member_id, organization_id, semester_id, membership_role, membership_points, active_member, active_semesters, createdAt, updatedAt) 
VALUES 
(3, 7, 2, 2245, 1, 15, TRUE, 2, '2024-03-01', '2024-03-01'),
(4, 8, 1, 2245, 0, 15, FALSE, 2, '2024-03-01', '2024-03-01');


INSERT INTO Membership (membership_id, member_id, organization_id, semester_id, membership_role, membership_points, active_member, active_semesters, createdAt, updatedAt) 
VALUES 
(5, 11, 1, 2245, 0, 25, TRUE, 3, '2022-03-01', '2023-03-01');

-- Insert into Event
INSERT INTO Event (organization_id, semester_id, event_name, event_start, event_end, event_location, event_description, event_type, createdAt, updatedAt) 
VALUES 
(1, 2241, 'Tech Hackathon', '2024-03-01', '2024-03-03', 'Tech Hall 101', 'A hackathon for coding enthusiasts', 'workshop', '2024-03-01', '2024-03-01'),
(2, 2245, 'Art Exhibition', '2024-10-05', NULL, 'Gallery Room', 'A showcase of student artwork', 'social', '2024-03-01', '2024-03-01');


INSERT INTO Event (organization_id, semester_id, event_name, event_start, event_end, event_location, event_description, event_type, createdAt, updatedAt) 
VALUES 
( 1, 2241, 'Women In Computing Annual Conference', '2024-04-10', '2024-04-10', 'RIT Campus, Auditorium', 
  'A full-day conference featuring keynote speakers, workshops, and networking for women in technology.',
  'general_meeting', NOW(), NOW() ),
(2, 2245, 'Spring Semester Hackathon', '2023-01-15', '2023-01-15', 'RIT Campus, Main Hall', 'A 12-hour hackathon where students collaborate to build projects and compete for prizes.',
  'social', NOW(), NOW() );

--  variety of volunteering events
INSERT INTO Event (organization_id, semester_id, event_name, event_start, event_end, event_location, event_description, event_type, createdAt, updatedAt) 
VALUES 
(2, 2241, 'Volunteer Day', '2024-06-12 08:00:00', '2024-06-12 15:00:00', 'Community Center', 'A day dedicated to community service', 'volunteer', NOW(), NOW()), 
(2, 2241, 'Beach Cleanup', '2024-03-18 09:00:00', '2024-03-18 13:00:00', 'Seaside Park', 'Join us for a morning of cleaning up the beach and protecting marine life.', 'volunteer', NOW(), NOW()), 
(1, 2241, 'Food Drive Distribution', '2022-04-05 10:00:00', '2022-04-05 16:00:00', 'Local Food Bank', 'Help distribute food to families in need.', 'volunteer', NOW(), NOW()), 
(1, 2245, 'Tree Planting Initiative', '2020-05-22 08:30:00', '2020-05-22 14:00:00', 'City Park', 'Help plant trees and improve the environment.', 'volunteer', NOW(), NOW()), 
(1, 2245, 'Homeless Shelter Assistance', '2024-11-03 18:00:00', '2024-11-03 22:00:00', 'City Homeless Shelter', 'Help serve food and provide support to the homeless.', 'volunteer', NOW(), NOW());

--  variety of general meeting events
INSERT INTO Event (organization_id, semester_id, event_name, event_start, event_end, event_location, event_description, event_type, createdAt, updatedAt) 
VALUES
(1, 2245, 'End-of-Year Wrap-up Meeting', '2022-06-10 17:30:00', '2022-06-10 19:00:00', 'Student Lounge', 'Final meeting of the semester to review achievements and future plans.', 'general_meeting', NOW(), NOW()), 
(1, 2245, 'New Member Orientation', '2024-09-05 16:00:00', '2024-09-05 17:30:00', 'Auditorium', 'Orientation for new members to learn about the club.', 'general_meeting', NOW(), NOW()), 
(2, 2245, 'Budget and Finance Meeting', '2023-10-08 14:00:00', '2023-10-08 15:30:00', 'Business Center Room 201', 'Discussion on financial planning and funding for events.', 'general_meeting', NOW(), NOW()), 
(2, 2245, 'Leadership Training Session', '2024-11-20 13:30:00', '2024-11-20 15:00:00', 'Leadership Center', 'Training for current and future organization leaders.', 'general_meeting', NOW(), NOW());


-- Insert into Attendance
INSERT INTO Attendance (member_id, event_id, check_in, volunteer_hours, createdAt, updatedAt) 
VALUES 
(1, 1, '2024-03-01', 5, '2024-03-01', '2024-03-01'),
(2, 2, '2024-10-05', 3, '2024-03-01', '2024-03-01');

-- sample Insert into Attendance
INSERT INTO Attendance (member_id, event_id, check_in, volunteer_hours, createdAt, updatedAt) 
VALUES 
(1, 6, '2022-03-01', 0, '2023-03-01', '2024-03-01'),
(8, 5, '2023-10-05', 13, '2024-03-01', '2024-03-01'),
(11, 4, '2025-02-01', 0, '2025-02-01', '2025-02-01'),
(9, 3, '2023-10-05', 13, '2024-03-01', '2024-03-01');

-- sample 2 Insert into Attendance
INSERT INTO Attendance (member_id, event_id, check_in, volunteer_hours, createdAt, updatedAt) 
VALUES 
(1, 11, '2024-09-05', 0, '2025-02-01', '2025-02-01'),
(8, 13, '2025-02-14', 13, '2025-02-14', '2025-02-14'),
(11, 5, '2024-06-12', 0, '2024-06-12', '2025-02-01');



-- Insert into Membership Requirement
INSERT INTO MembershipRequirement (organization_id, meeting_type, frequency, amount_type, amount, requirement_scope, createdAt, updatedAt) 
VALUES 
(1, 'general_meeting', 'monthly', 'points', 10, 'semesterly', '2024-03-01', '2024-03-01'),
(2, 'workshop', 'weekly', 'percentage', 50, 'annually', '2024-03-01', '2024-03-01');

-- Insert into EmailSettings
INSERT INTO EmailSettings (organization_id, current_status, annual_report, semester_report, membership_achieved, createdAt, updatedAt) 
VALUES 
(1, TRUE, TRUE, TRUE, FALSE, '2024-03-01', '2024-03-01'),
(2, FALSE, FALSE, TRUE, TRUE, '2024-03-01', '2024-03-01');

-- ==============================
-- Select and Verify Data
-- ==============================

-- Verify Organizations
SELECT * FROM Organization;

-- Verify Semesters
SELECT * FROM Semester;

-- Verify Members
SELECT * FROM Member;

-- Verify Memberships
SELECT * FROM Membership;

-- Verify Events
SELECT * FROM Event;

-- Verify Attendance
SELECT * FROM Attendance;

-- Verify Membership Requirements
SELECT * FROM MembershipRequirement;

-- Verify Email Settings
SELECT * FROM EmailSettings;


-- used for testing for reports
SELECT Member.member_id, Member.member_name FROM `Member` INNER JOIN `Membership` ON Membership.member_id = Member.member_id WHERE Membership.organization_id = 1 AND Membership.createdAt >= '2024-01-01 00:00:00' AND Membership.createdAt < '2025-01-01 00:00:00';

SELECT event_id, event_start, event_end FROM Event WHERE event_start >= '2024-01-01 00:00:00' AND event_end < '2025-01-01 00:00:00';

SELECT event_id, event_start, event_end  FROM Event WHERE organization_id = 1 AND event_start >= '2024-01-01 00:00:00' AND event_end < '2025-01-01 00:00:00';

SELECT event_id, event_start, event_end FROM Event WHERE event_start >= '2023-01-01 00:00:00' AND event_end < '2024-01-01 00:00:00';

SELECT Attendance.attendance_id FROM Attendance JOIN Event ON Attendance.event_id = Event.event_id WHERE Event.organization_id = 2 AND check_in >= '2024-01-01 00:00:00' AND check_in < '2025-01-01 00:00:00';
