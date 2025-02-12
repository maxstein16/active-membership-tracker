-- ===================================
-- Drop existing database and recreate
-- ===================================
CREATE DATABASE membertracker;
USE membertracker;

-- ==============================
-- Insert Test Data
-- ==============================

-- Insert into Organization
INSERT INTO Organization (organization_name, organization_description, organization_color, organization_abbreviation, organization_threshold) 
VALUES 
('Tech Club', 'A club for tech enthusiasts', 'blue', 'TC', 10),
('Art Society', 'A group for artists and designers', 'red', 'AS', 5);

-- Insert into Semester
INSERT INTO Semester (semester_id, semester_name, academic_year, start_date, end_date) 
VALUES 
(2241, 'Spring 2024', '2023-2024', '2024-01-15', '2024-05-10'),
(2245, 'Fall 2024', '2024-2025', '2024-08-20', '2024-12-15');

-- Insert into Member
INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status) 
VALUES 
('John Doe', 'johndoe@university.edu', 'john.doe@gmail.com', '123-456-7890', '2025-05-15', 'M', 'Computer Science', 'Male', 'White', 'undergraduate'),
('Jane Smith', 'janesmith@university.edu', 'jane.smith@gmail.com', '987-654-3210', '2026-05-20', 'S', 'Fine Arts', 'Female', 'Asian', 'undergraduate');

-- Insert into Membership
INSERT INTO Membership (member_id, organization_id, semester_id, membership_role, membership_points, active_member, active_semesters) 
VALUES 
(1, 1, 2241, 1, 15, TRUE, 2),
(2, 2, 2245, 0, 5, FALSE, 1);

-- Insert into Event
INSERT INTO Event (organization_id, semester_id, event_name, event_start, event_end, event_location, event_description, event_type) 
VALUES 
(1, 2241, 'Tech Hackathon', '2024-03-01', '2024-03-03', 'Tech Hall 101', 'A hackathon for coding enthusiasts', 'workshop'),
(2, 2245, 'Art Exhibition', '2024-10-05', NULL, 'Gallery Room', 'A showcase of student artwork', 'social');

-- Insert into Attendance
INSERT INTO Attendance (member_id, event_id, check_in, volunteer_hours) 
VALUES 
(1, 1, '2024-03-01', 5),
(2, 2, '2024-10-05', 3);

-- Insert into Membership Requirement
INSERT INTO MembershipRequirement (organization_id, meeting_type, frequency, amount_type, amount, requirement_scope) 
VALUES 
(1, 'general_meeting', 'monthly', 'points', 10, 'semesterly'),
(2, 'workshop', 'weekly', 'percentage', 50, 'annually');

-- Insert into EmailSettings
INSERT INTO EmailSettings (organization_id, current_status, annual_report, semester_report, membership_achieved) 
VALUES 
(1, TRUE, TRUE, TRUE, FALSE),
(2, FALSE, FALSE, TRUE, TRUE);

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
