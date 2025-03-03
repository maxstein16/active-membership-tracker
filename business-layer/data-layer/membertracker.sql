-- Drop the database if it exists (use with caution)
-- DROP DATABASE membertracker;

-- Create the database
CREATE DATABASE membertracker;

-- Use the newly created database
USE membertracker;

-- ==============================
-- Organization Table
-- ==============================
CREATE TABLE Organization (
  organization_id INT AUTO_INCREMENT, -- Unique ID for each organization
  organization_name VARCHAR(255) NOT NULL, -- Name of the organization
  organization_description TEXT, -- Description of the organization
  organization_color VARCHAR(255), -- Primary color theme
  organization_abbreviation VARCHAR(10), -- Shortened name or acronym
  organization_email VARCHAR (50) -- Email for automated notifications
  organization_membership_type ENUM('points', 'attendance') -- Primary way of achieving membership
  organization_threshold INT DEFAULT 0, -- Minimum threshold for active membership
  PRIMARY KEY (organization_id)
);

-- ==============================
-- Semester Table
-- ==============================
CREATE TABLE Semester (
  semester_id INT NOT NULL, -- Term ID for each semester (e.g., 2241, 2245)
  semester_name VARCHAR(50) NOT NULL, -- Semester name (e.g., Fall 2024, Spring 2025)
  academic_year VARCHAR(9) NOT NULL, -- Academic year (e.g., 2024-2025)
  start_date DATE NOT NULL, -- Start date of the semester
  end_date DATE NOT NULL, -- End date of the semester
  PRIMARY KEY (semester_id)
);

-- ==============================
-- Member Table
-- ==============================
CREATE TABLE Member (
  member_id INT AUTO_INCREMENT, -- Unique ID for each member
  member_name VARCHAR(255) NOT NULL, -- Full name of the member
  member_email VARCHAR(255) UNIQUE NOT NULL, -- University or primary email
  member_personal_email VARCHAR(255), -- Personal email (optional)
  member_phone_number VARCHAR(15), -- Contact number
  member_graduation_date DATE, -- Expected graduation date
  member_tshirt_size VARCHAR(10), -- T-shirt size for events, swag, etc.
  member_major VARCHAR(255), -- Member's academic major
  member_gender VARCHAR(50), -- Gender identifier
  member_race VARCHAR(50), -- Race/Ethnicity identifier
  member_status ENUM('undergraduate', 'graduate', 'staff', 'faculty', 'alumni') DEFAULT 'undergraduate', -- Membership status
  PRIMARY KEY (member_id)
);

-- ==============================
-- Membership Table
-- ==============================
CREATE TABLE Membership (
  membership_id INT AUTO_INCREMENT, -- Unique ID for each membership record
  member_id INT, -- Member associated with this membership
  organization_id INT, -- Organization the member belongs to
  semester_id INT, -- Semester in which this membership is valid
  membership_role INT, -- Role within the organization (e.g., 0=Member, 1=E-Board, 2=Admin)
  membership_points INT DEFAULT 0, -- Points earned in the organization
  active_member BOOLEAN DEFAULT FALSE, -- Whether the member is currently active
  active_semesters INT DEFAULT 0, -- Total number of active semesters
  PRIMARY KEY (membership_id),
  FOREIGN KEY (member_id) REFERENCES Member(member_id),
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id),
  FOREIGN KEY (semester_id) REFERENCES Semester(semester_id)
);

-- ==============================
-- Event Table
-- ==============================
CREATE TABLE Event (
  event_id INT AUTO_INCREMENT, -- Unique ID for each event
  organization_id INT, -- Organization hosting the event
  semester_id INT, -- Semester in which the event occurs
  event_name VARCHAR(255) NOT NULL, -- Name of the event
  event_start DATE NOT NULL, -- Event start date
  event_end DATE, -- Event end date (if multi-day)
  event_location VARCHAR(255), -- Venue or online link
  event_description TEXT, -- Event details
  event_type ENUM('general_meeting', 'volunteer', 'social', 'workshop', 'fundraiser', 'committee') NOT NULL, -- Categorized event type
  PRIMARY KEY (event_id),
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id),
  FOREIGN KEY (semester_id) REFERENCES Semester(semester_id)
);

-- ==============================
-- Attendance Table
-- ==============================
CREATE TABLE Attendance (
  attendance_id INT AUTO_INCREMENT, -- Unique ID for each attendance record
  member_id INT, -- Member who attended
  event_id INT, -- Event attended
  PRIMARY KEY (attendance_id),
  FOREIGN KEY (member_id) REFERENCES Member(member_id),
  FOREIGN KEY (event_id) REFERENCES Event(event_id)
);

-- ==============================
-- Membership Requirement Table
-- ==============================
CREATE TABLE MembershipRequirement (
  requirement_id INT AUTO_INCREMENT, -- Unique ID for each requirement setting
  organization_id INT, -- Organization this requirement applies to
  event_type VARCHAR(255) NOT NULL, -- Type of meeting (e.g., general meeting, social)
  requirement_type ENUM('points', 'percentage', 'attendance_count') NOT NULL, -- What the requirement is measured in
  requirement_value FLOAT NOT NULL, -- Required points or percentage
  PRIMARY KEY (requirement_id),
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);

-- ==============================
-- Bonus Requirement Table
-- ==============================
CREATE TABLE BonusRequirement (
  bonus_id INT AUTO_INCREMENT PRIMARY KEY,
  requirement_id INT NOT NULL,  -- Links to the relevant membership requirement
  threshold_percentage FLOAT NOT NULL,  -- Attendance percentage needed
  bonus_points FLOAT NOT NULL,  -- Points awarded at this threshold
  PRIMARY KEY (bonus_id),
  FOREIGN KEY (requirement_id) REFERENCES MembershipRequirement(requirement_id)
);

-- ==============================
-- Email Settings Table
-- ==============================
CREATE TABLE EmailSettings (
  email_setting_id INT AUTO_INCREMENT, -- Unique ID for each email setting
  organization_id INT, -- Organization this setting applies to
  current_status BOOLEAN DEFAULT FALSE, -- Whether emails are currently enabled
  annual_report BOOLEAN DEFAULT FALSE, -- Whether annual reports should be sent
  semester_report BOOLEAN DEFAULT FALSE, -- Whether semester reports should be sent
  membership_achieved BOOLEAN DEFAULT FALSE, -- Whether members are notified when achieving active status
  PRIMARY KEY (email_setting_id),
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id)
);