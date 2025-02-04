-- Create the database
-- DROP DATABASE membertracker;
CREATE DATABASE membertracker;

-- Use the newly created database
USE membertracker;

-- Create the Organization table
CREATE TABLE Organization (
  organization_id INT,
  organization_name VARCHAR(255),
  organization_description VARCHAR(255),
  organization_color VARCHAR(255),
  org_abbreviation VARCHAR(10),
  active_membership_threshold INT,
  PRIMARY KEY (organization_id)
);

-- Create the Member table
CREATE TABLE Member (
  member_id INT,
  member_name VARCHAR(255),
  member_email VARCHAR(255),
  member_personal_email VARCHAR(255),
  member_phone_number VARCHAR(255),
  member_graduation_date DATE,
  member_tshirt_size VARCHAR(255),
  member_major VARCHAR(255),
  member_gender VARCHAR(255),
  member_race VARCHAR(255),
  PRIMARY KEY (member_id)
);

-- Create the Membership table
CREATE TABLE Membership (
  membership_id INT,
  member_id INT,
  organization_id INT,
  membership_role INT,
  membership_points INT,
  active_member BOOLEAN,
  active_semesters INT,
  PRIMARY KEY (membership_id),
  FOREIGN KEY (member_id) REFERENCES Member (member_id),
  FOREIGN KEY (organization_id) REFERENCES Organization (organization_id)
);

-- Create the Attendance table
CREATE TABLE Attendance (
  attendance_id INT,
  member_id INT,
  event_id INT,
  check_in DATE,
  PRIMARY KEY (attendance_id),
  FOREIGN KEY (member_id) REFERENCES Member (member_id),
  FOREIGN KEY (event_id) REFERENCES Event (event_id)
);

-- Create the event table 
CREATE TABLE Event (
  event_id INT,
  event_name VARCHAR(255),
  event_start DATE,
  event_end DATE,
  event_location VARCHAR(255),
  event_description VARCHAR(255),
  event_type VARCHAR(255),
  PRIMARY KEY (event_id)
);

-- Create the Recognition table
CREATE TABLE Recognition (
  recognition_id INT,
  member_id INT,
  recognition_year INT,
  recognition_type INT,
  PRIMARY KEY (recognition_id),
  FOREIGN KEY (member_id) REFERENCES Member (member_id)
);

-- Create the MembershipRequirement table
CREATE TABLE MembershipRequirement (
  requirement_id INT PRIMARY KEY AUTO_INCREMENT,
  organization_id INT,
  meeting_type VARCHAR(255),
  frequency VARCHAR(255),
  amount_type VARCHAR(255),
  amount Float,
  FOREIGN KEY (organization_id) REFERENCES Organization (organization_id)
);

-- Create the EmailSetting table
CREATE TABLE EmailSetting (
  setting_id INT PRIMARY KEY AUTO_INCREMENT,
  organization_id INT,
  current_status BOOLEAN,
  annual_report BOOLEAN,
  semester_report BOOLEAN,
  membership_achieved BOOLEAN,
  FOREIGN KEY (organization_id) REFERENCES Organization (organization_id)
);