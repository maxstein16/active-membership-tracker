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
  member_gender INT,
  member_race VARCHAR(255),
  PRIMARY KEY (member_id)
);

-- Create the Membership table
CREATE TABLE Membership (
  membership_id INT,
  member_id INT,
  organization_id INT,
  role INT,
  PRIMARY KEY (membership_id),
  FOREIGN KEY (member_id) REFERENCES Member (member_id),
  FOREIGN KEY (organization_id) REFERENCES Organization (organization_id)
);

-- Create the Attendance table
CREATE TABLE Attendance (
  attendance_id INT,
  member_id INT,
  event_id INT,
  attendance_status INT,
  PRIMARY KEY (attendance_id),
  FOREIGN KEY (member_id) REFERENCES Member (member_id)
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
