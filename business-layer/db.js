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
    organization_email: { type: DataTypes.STRING },
    organization_membership_type: { type: DataTypes.STRING },
    organization_threshold: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    timestamps: false,
  }
);

const Semester = sequelize.define(
  "Semester",
  {
    semester_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    semester_name: { type: DataTypes.STRING(50), allowNull: false },
    academic_year: { type: DataTypes.STRING(9), allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const Member = sequelize.define(
  "Member",
  {
    member_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    member_name: { type: DataTypes.STRING, allowNull: false },
    member_email: { type: DataTypes.STRING, allowNull: false, unique: true },
    member_personal_email: { type: DataTypes.STRING },
    member_phone_number: { type: DataTypes.STRING(15) },
    member_graduation_date: { type: DataTypes.DATE },
    member_tshirt_size: { type: DataTypes.STRING(10) },
    member_major: { type: DataTypes.STRING },
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

const Membership = sequelize.define(
  "Membership",
  {
    membership_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    membership_role: { type: DataTypes.INTEGER },
    membership_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    active_member: { type: DataTypes.BOOLEAN, defaultValue: false },
    received_bonus: { type: DataTypes.JSON, defaultValue: [] },
  },
  {
    timestamps: false,
  }
);

const Event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_name: { type: DataTypes.STRING, allowNull: false },
    event_start: { type: DataTypes.DATE, allowNull: false },
    event_end: { type: DataTypes.DATE },
    event_location: { type: DataTypes.STRING },
    event_description: { type: DataTypes.TEXT },
    event_type: {
      type: DataTypes.ENUM(
        "General Meeting",
        "Volunteer",
        "Social",
        "Workshop",
        "Fundraiser",
        "Hackathon",
        "Committee"
      ),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

const MembershipRequirement = sequelize.define(
  "MembershipRequirement",
  {
    requirement_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_type: { type: DataTypes.STRING, allowNull: false },
    requirement_type: {
      type: DataTypes.ENUM("points", "percentage", "attendance_count"),
      allowNull: false,
    },
    requirement_value: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const BonusRequirement = sequelize.define(
  "BonusRequirement",
  {
    bonus_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    threshold_percentage: { type: DataTypes.FLOAT, allowNull: false },
    bonus_points: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const EmailSettings = sequelize.define(
  "EmailSettings",
  {
    email_setting_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    current_status: { type: DataTypes.BOOLEAN, defaultValue: false },
    annual_report: { type: DataTypes.BOOLEAN, defaultValue: false },
    semester_report: { type: DataTypes.BOOLEAN, defaultValue: false },
    membership_achieved: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    timestamps: false,
  }
);

// Organizations
Organization.hasMany(Event, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Organization.hasMany(Membership, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Organization.hasMany(MembershipRequirement, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Organization.hasMany(EmailSettings, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});

// Members
Member.hasMany(Membership, { foreignKey: "member_id", onDelete: "CASCADE" });
Member.hasMany(Attendance, { foreignKey: "member_id", onDelete: "CASCADE" });

// Memberships
Membership.belongsTo(Member, { foreignKey: "member_id", onDelete: "CASCADE" });
Membership.belongsTo(Organization, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Membership.belongsTo(Semester, {
  foreignKey: "semester_id",
  onDelete: "CASCADE",
});

// Events
Event.belongsTo(Organization, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Event.belongsTo(Semester, { foreignKey: "semester_id", onDelete: "CASCADE" });
Event.hasMany(Attendance, { foreignKey: "event_id", onDelete: "SET NULL" });

// Attendance
Attendance.belongsTo(Member, { foreignKey: "member_id", onDelete: "CASCADE" });
Attendance.belongsTo(Event, { foreignKey: "event_id", onDelete: "CASCADE" });

// Membership Requirements & Bonus
MembershipRequirement.belongsTo(Organization, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});

BonusRequirement.belongsTo(MembershipRequirement, {
  foreignKey: "requirement_id",
  onDelete: "CASCADE",
});

// sequelize.sync({ alter: true })
//   .then(() => console.log('Database & tables created!'))
//   .catch(err => console.error('Error syncing database:', err));

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
