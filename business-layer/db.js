require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  "membertracker",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mariadb",
    logging: false,
    define: {
      freezeTableName: true, // Prevents Sequelize from pluralizing table names
    },
  }
);

// ==============================
// Organization Model
// ==============================
const Organization = sequelize.define("Organization", {
  organization_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organization_description: DataTypes.STRING,
  organization_color: DataTypes.STRING,
  organization_abbreviation: DataTypes.STRING(10),
  organization_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// ==============================
// Semester Model
// ==============================
const Semester = sequelize.define("Semester", {
  semester_id: {
    type: DataTypes.INTEGER, // Follows RIT term IDs (e.g., 2241, 2245)
    primaryKey: true,
  },
  semester_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// ==============================
// Member Model
// ==============================
const Member = sequelize.define("Member", {
  member_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  member_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  member_personal_email: DataTypes.STRING,
  member_phone_number: DataTypes.STRING,
  member_graduation_date: DataTypes.DATE,
  member_tshirt_size: DataTypes.STRING,
  member_major: DataTypes.STRING,
  member_gender: DataTypes.STRING,
  member_race: DataTypes.STRING,
  member_status: {
    type: DataTypes.ENUM(
      "undergraduate",
      "graduate",
      "staff",
      "faculty",
      "alumni"
    ),
    defaultValue: "undergraduate",
  },
});

// ==============================
// Membership Model
// ==============================
const Membership = sequelize.define("Membership", {
  membership_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  membership_role: {
    type: DataTypes.INTEGER, // 0=Member, 1=E-Board, 2=Admin
    allowNull: false,
  },
  membership_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  active_member: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  active_semesters: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// ==============================
// Event Model
// ==============================
const Event = sequelize.define("Event", {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  event_end: DataTypes.DATE,
  event_location: DataTypes.STRING,
  event_description: DataTypes.TEXT,
  event_type: {
    type: DataTypes.ENUM(
      "general_meeting",
      "volunteer",
      "social",
      "workshop",
      "fundraiser",
      "committee"
    ),
    allowNull: false,
  },
});

// ==============================
// Attendance Model
// ==============================
const Attendance = sequelize.define("Attendance", {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  volunteer_hours: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

// ==============================
// Membership Requirement Model
// ==============================
const MembershipRequirement = sequelize.define("MembershipRequirement", {
  setting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  meeting_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount_type: {
    type: DataTypes.ENUM("points", "percentage"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  requirement_scope: {
    type: DataTypes.ENUM("semesterly", "annually"),
    allowNull: false,
  },
});

// ==============================
// Email Settings Model
// ==============================
const EmailSettings = sequelize.define("EmailSettings", {
  email_setting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  current_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  annual_report: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  semester_report: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  membership_achieved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// ==============================
// Define Associations
// ==============================

Organization.hasMany(Membership, { foreignKey: "organization_id" });
Membership.belongsTo(Organization, { foreignKey: "organization_id" });

Organization.hasMany(Event, { foreignKey: "organization_id" });
Event.belongsTo(Organization, { foreignKey: "organization_id" });

Organization.hasMany(MembershipRequirement, { foreignKey: "organization_id" });
MembershipRequirement.belongsTo(Organization, {
  foreignKey: "organization_id",
});

Organization.hasMany(EmailSettings, { foreignKey: "organization_id" });
EmailSettings.belongsTo(Organization, { foreignKey: "organization_id" });

Member.hasMany(Membership, { foreignKey: "member_id" });
Membership.belongsTo(Member, { foreignKey: "member_id" });

Member.hasMany(Attendance, { foreignKey: "member_id" });
Attendance.belongsTo(Member, { foreignKey: "member_id" });

Semester.hasMany(Membership, { foreignKey: "semester_id" });
Membership.belongsTo(Semester, { foreignKey: "semester_id" });

Semester.hasMany(Event, { foreignKey: "semester_id" });
Event.belongsTo(Semester, { foreignKey: "semester_id" });

Event.hasMany(Attendance, { foreignKey: "event_id" });
Attendance.belongsTo(Event, { foreignKey: "event_id" });

module.exports = {
  sequelize,
  Organization,
  Semester,
  Member,
  Membership,
  Attendance,
  Event,
  MembershipRequirement,
  EmailSettings,
};