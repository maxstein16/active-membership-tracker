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
  organization_abbreviation: {
    type: DataTypes.STRING(10),
  },
  organization_threshold: {
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
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Member",
      key: "member_id",
    },
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Organization",
      key: "organization_id",
    },
  },
  membership_role: DataTypes.INTEGER, // FIXED naming
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

const Attendance = sequelize.define("Attendance", {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Member",
      key: "member_id",
    },
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Event",
      key: "event_id",
    },
  },
  check_in: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Replaced attendance_status
  },
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
  event_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  event_end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  event_location: DataTypes.STRING,
  event_description: DataTypes.STRING,
  event_type: DataTypes.STRING,
});

const MembershipRequirement = sequelize.define("MembershipRequirement", {
  requirement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Organization",
      key: "organization_id",
    },
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
    type: DataTypes.STRING, // "points" or "percentage"
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const EmailSetting = sequelize.define("EmailSetting", {
  setting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organization_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Organization",
      key: "organization_id",
    },
  },
  current_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  annual_report: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  semester_report: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  membership_achieved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

// Define associations
Organization.hasMany(Membership, {
  foreignKey: "organization_id",
  as: "memberships",
});
Membership.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

Member.hasMany(Membership, { foreignKey: "member_id", as: "memberships" });
Membership.belongsTo(Member, { foreignKey: "member_id", as: "member" });

Member.hasMany(Attendance, { foreignKey: "member_id", as: "attendances" });
Attendance.belongsTo(Member, { foreignKey: "member_id", as: "member" });

Event.hasMany(Attendance, { foreignKey: "event_id", as: "attendances" });
Attendance.belongsTo(Event, { foreignKey: "event_id", as: "event" });

Organization.hasMany(MembershipRequirement, {
  foreignKey: "organization_id",
  as: "membership_requirements",
});
MembershipRequirement.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

Organization.hasMany(EmailSetting, {
  foreignKey: "organization_id",
  as: "email_settings",
});
EmailSetting.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

module.exports = {
  sequelize,
  Organization,
  Member,
  Membership,
  Attendance,
  Event,
  MembershipRequirement,
  EmailSetting,
};
