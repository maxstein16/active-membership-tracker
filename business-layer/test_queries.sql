-- ===================================
-- Drop existing database and recreate
-- ===================================

USE membertracker;

-- Insert sample data into Organization table
INSERT INTO Organization (organization_name, organization_description, organization_color, organization_abbreviation, organization_threshold, organization_email) VALUES
('Women in Computing', 'A community for women in tech', '#FF69B4', 'WiC', 10, 'contact@wic.org'),
('Society of Software Engineers', 'A group for software engineering students', '#0000FF', 'SSE', 15, 'contact@sse.org');

-- Insert sample data into Semester table
INSERT INTO Semester (semester_id, semester_name, academic_year, start_date, end_date) VALUES
(2241, 'Spring 2024', '2023-2024', '2024-01-15', '2024-05-10'),
(2245, 'Fall 2024', '2024-2025', '2024-08-25', '2024-12-15');

-- Insert sample data into Member (at least 10 members)
INSERT INTO Member (member_name, member_email, member_personal_email, member_phone_number, member_graduation_date, member_tshirt_size, member_major, member_gender, member_race, member_status) VALUES
('Alice Johnson', 'alice.johnson@uni.edu', 'alicej@gmail.com', '123-456-7890', '2025-05-15', 'M', 'Computer Science', 'Female', 'White', 'undergraduate'),
('Bob Smith', 'bob.smith@uni.edu', 'bobsmith@gmail.com', '234-567-8901', '2026-12-10', 'L', 'Software Engineering', 'Male', 'Hispanic', 'undergraduate'),
('Charlie Davis', 'charlie.davis@uni.edu', 'charlied@gmail.com', '345-678-9012', '2025-05-15', 'XL', 'Cybersecurity', 'Male', 'Black', 'graduate'),
('Diana Prince', 'diana.prince@uni.edu', 'dprince@yahoo.com', '456-789-0123', '2024-12-15', 'S', 'Web & Mobile Computing', 'Female', 'Asian', 'undergraduate'),
('Ethan Wright', 'ethan.wright@uni.edu', 'ethanw@gmail.com', '567-890-1234', '2025-08-20', 'M', 'Information Technology', 'Male', 'White', 'undergraduate'),
('Fiona Green', 'fiona.green@uni.edu', 'fionag@hotmail.com', '678-901-2345', '2026-05-10', 'M', 'Software Engineering', 'Female', 'Black', 'graduate'),
('George Miller', 'george.miller@uni.edu', 'georgem@gmail.com', '789-012-3456', '2024-12-15', 'L', 'Data Science', 'Male', 'Asian', 'staff'),
('Hannah Lee', 'hannah.lee@uni.edu', 'hlee@gmail.com', '890-123-4567', '2025-05-15', 'S', 'Human-Computer Interaction', 'Female', 'Hispanic', 'faculty'),
('Isaac Newton', 'isaac.newton@uni.edu', 'inewton@outlook.com', '901-234-5678', '2027-05-15', 'XL', 'AI & Robotics', 'Male', 'White', 'undergraduate'),
('Julia Roberts', 'julia.roberts@uni.edu', 'jroberts@gmail.com', '012-345-6789', '2025-12-15', 'M', 'Computer Science', 'Female', 'Asian', 'undergraduate');

-- Insert sample data into Membership
INSERT INTO Membership (member_id, organization_id, semester_id, membership_role, membership_points, active_member, active_semesters) VALUES
(1, 1, 2241, 1, 15, TRUE, 2),
(2, 1, 2241, 2, 8, FALSE, 1),
(3, 2, 2241, 1, 20, TRUE, 3),
(4, 2, 2245, 2, 12, TRUE, 2),
(5, 1, 2245, 1, 9, FALSE, 1),
(6, 2, 2241, 2, 18, TRUE, 2),
(7, 1, 2245, 1, 5, FALSE, 1),
(8, 2, 2245, 2, 14, TRUE, 2),
(9, 1, 2241, 1, 11, TRUE, 2),
(10, 2, 2241, 2, 16, TRUE, 3);

-- Insert sample data into Event table
INSERT INTO Event (organization_id, semester_id, event_name, event_start, event_end, event_location, event_description, event_type) VALUES
(1, 2241, 'WiC Networking Night', '2024-03-10', '2024-03-10', 'Golisano Hall', 'An evening to network with industry professionals.', 'general_meeting'),
(2, 2245, 'SSE Hackathon', '2024-10-15', '2024-10-16', 'Innovation Center', '24-hour coding hackathon.', 'workshop');

-- Insert sample data into Attendance table
INSERT INTO Attendance (member_id, event_id, check_in, volunteer_hours) VALUES
(1, 1, '2024-03-10 18:30:00', 2),
(2, 2, '2024-10-15 09:00:00', 5);

-- Insert sample data into MembershipRequirement table
INSERT INTO MembershipRequirement (organization_id, meeting_type, frequency, amount_type, amount, requirement_scope) VALUES
(1, 'general_meeting', 'monthly', 'points', 5, 'semesterly'),
(2, 'workshop', 'semesterly', 'percentage', 50, 'annually');

-- Insert sample data into EmailSettings table
INSERT INTO EmailSettings (organization_id, current_status, annual_report, semester_report, membership_achieved) VALUES
(1, TRUE, TRUE, FALSE, TRUE),
(2, FALSE, TRUE, TRUE, FALSE);


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
