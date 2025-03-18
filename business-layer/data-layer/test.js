require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize with database connection
const sequelize = new Sequelize(
  "membertracker",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mariadb",
    logging: false,
    define: {
      freezeTableName: true,
    },
  }
);

// Define Organization model
const Organization = sequelize.define(
  "Organization",
  {
    organization_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    organization_name: { type: DataTypes.STRING, allowNull: false },
    organization_description: { type: DataTypes.TEXT },
    organization_color: { type: DataTypes.STRING },
    organization_abbreviation: { type: DataTypes.STRING(10) },
    organization_email: { type: DataTypes.STRING(255) },
    organization_membership_type: {
      type: DataTypes.ENUM("points", "attendance"),
    },
    organization_threshold: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: false,
  }
);

// Define Semester model
const Semester = sequelize.define(
  "Semester",
  {
    semester_id: { type: DataTypes.INTEGER, primaryKey: true },
    semester_name: { type: DataTypes.STRING(50), allowNull: false },
    academic_year: { type: DataTypes.STRING(9), allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
  },
  {
    timestamps: false,
  }
);

// Define Member model
const Member = sequelize.define(
  "Member",
  {
    member_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    member_name: { type: DataTypes.STRING(255), allowNull: false },
    member_email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    member_personal_email: { type: DataTypes.STRING(255) },
    member_phone_number: { type: DataTypes.STRING(15) },
    member_graduation_date: { type: DataTypes.DATEONLY },
    member_tshirt_size: { type: DataTypes.STRING(10) },
    member_major: { type: DataTypes.STRING(255) },
    member_gender: { type: DataTypes.STRING(50) },
    member_race: { type: DataTypes.STRING(50) },
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
  },
  {
    timestamps: false,
  }
);

// Define Membership model
const Membership = sequelize.define("Membership", {
  membership_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  membership_role: { type: DataTypes.INTEGER },
  membership_points: { type: DataTypes.INTEGER, defaultValue: 0 },
  active_member: { type: DataTypes.BOOLEAN, defaultValue: false },
  received_bonus: { type: DataTypes.JSON, defaultValue: [] },
});
Membership.belongsTo(Member, { foreignKey: "member_id", onDelete: "CASCADE" });
Membership.belongsTo(Organization, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Membership.belongsTo(Semester, {
  foreignKey: "semester_id",
  onDelete: "CASCADE",
});

// Define Event model
const Event = sequelize.define("Event", {
  event_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  event_name: { type: DataTypes.STRING(255), allowNull: false },
  event_start: { type: DataTypes.DATEONLY, allowNull: false },
  event_end: { type: DataTypes.DATEONLY },
  event_location: { type: DataTypes.STRING(255) },
  event_description: { type: DataTypes.TEXT },
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
Event.belongsTo(Organization, { foreignKey: "organization_id" });
Event.belongsTo(Semester, { foreignKey: "semester_id" });

// Define Attendance model
const Attendance = sequelize.define("Attendance", {
  attendance_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});
Attendance.belongsTo(Member, { foreignKey: "member_id" });
Attendance.belongsTo(Event, { foreignKey: "event_id" });

// Define MembershipRequirement model
const MembershipRequirement = sequelize.define("MembershipRequirement", {
  requirement_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  event_type: { type: DataTypes.STRING(255), allowNull: false },
  requirement_type: {
    type: DataTypes.ENUM("points", "percentage", "attendance_count"),
    allowNull: false,
  },
  requirement_value: { type: DataTypes.FLOAT, allowNull: false },
});
MembershipRequirement.belongsTo(Organization, {
  foreignKey: "organization_id",
});

// Define BonusRequirement model
const BonusRequirement = sequelize.define("BonusRequirement", {
  bonus_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  threshold_percentage: { type: DataTypes.FLOAT, allowNull: false },
  bonus_points: { type: DataTypes.FLOAT, allowNull: false },
});
BonusRequirement.belongsTo(MembershipRequirement, {
  foreignKey: "requirement_id",
});

// Define EmailSettings model
const EmailSettings = sequelize.define("EmailSettings", {
  email_setting_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  current_status: { type: DataTypes.BOOLEAN, defaultValue: false },
  annual_report: { type: DataTypes.BOOLEAN, defaultValue: false },
  semester_report: { type: DataTypes.BOOLEAN, defaultValue: false },
  membership_achieved: { type: DataTypes.BOOLEAN, defaultValue: false },
});
EmailSettings.belongsTo(Organization, { foreignKey: "organization_id" });

// Sync models with the database
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced!"))
  .catch((err) => console.error("Sync failed:", err));

module.exports = {
  sequelize,
  Organization,
  Semester,
  Member,
  Membership,
  Event,
  Attendance,
  MembershipRequirement,
  BonusRequirement,
  EmailSettings,
};
