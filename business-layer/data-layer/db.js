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
      freezeTableName: true,
    },
  }
);

// Define models
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
  org_abbreviation: {
    type: DataTypes.STRING(10),
  },
  active_membership_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

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
});

const Membership = sequelize.define("Membership", {
  membership_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  org_role: DataTypes.INTEGER,
  member_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  active_member: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Attendance = sequelize.define("Attendance", {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attendance_status: DataTypes.INTEGER,
});

const Event = sequelize.define("Event", {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  event_location: DataTypes.STRING,
  event_description: DataTypes.STRING,
  event_type: DataTypes.STRING,
});

const Recognition = sequelize.define("Recognition", {
  recognition_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recognition_year: DataTypes.INTEGER,
  recognition_type: DataTypes.INTEGER,
});

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
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const EmailSettings = sequelize.define("EmailSettings", {
  setting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  current_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  annual_report: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester_report: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membership_achieved: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define associations
EmailSettings.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

Member.hasMany(Membership, {
  foreignKey: "member_id",
  as: "memberships",
});

Membership.belongsTo(Member, {
  foreignKey: "member_id",
  as: "member",
});

Organization.hasMany(Membership, {
  foreignKey: "organization_id",
  as: "memberships",
});

Membership.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

Member.hasMany(Attendance, {
  foreignKey: "member_id",
  as: "attendances",
});

Attendance.belongsTo(Member, {
  foreignKey: "member_id",
  as: "member",
});

Event.hasMany(Attendance, {
  foreignKey: "event_id",
  as: "attendances",
});

Attendance.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

Member.hasMany(Recognition, {
  foreignKey: "member_id",
  as: "recognitions",
});

Recognition.belongsTo(Member, {
  foreignKey: "member_id",
  as: "member",
});

MembershipRequirement.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});
module.exports = {
  sequelize,
  Organization,
  Member,
  Membership,
  Attendance,
  Recognition,
  Event,
  MembershipRequirement,
  EmailSettings,
};
