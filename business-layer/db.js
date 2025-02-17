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
const Organization = sequelize.define(
  "Organization", {
    organization_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organization_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organization_description: DataTypes.TEXT,
    organization_color: DataTypes.STRING,
    org_abbreviation: {
      type: DataTypes.STRING(10),
      field: 'organization_abbreviation'
    },
    active_membership_threshold: {
      type: DataTypes.INTEGER,
      field: 'organization_threshold',
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

// ==============================
// Semester Model
// ==============================
const Semester = sequelize.define("Semester", 
  {
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
  },
  {
    timestamps: false,
  }
);

// ==============================
// Member Model
// ==============================
const Member = sequelize.define(
  "Member",
  {
    member_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "member_id" // Ensure field mapping
    },
    member_name: {
      type: DataTypes.STRING,
      field: "member_name"
    },
    member_email: {
      type: DataTypes.STRING,
      field: "member_email"
    },
    member_personal_email: {
      type: DataTypes.STRING,
      field: "member_personal_email"
    },
    member_phone_number: {
      type: DataTypes.STRING,
      field: "member_phone_number"
    },
    member_graduation_date: {
      type: DataTypes.DATE,
      field: "member_graduation_date"
    },
    member_tshirt_size: {
      type: DataTypes.STRING,
      field: "member_tshirt_size"
    },
    member_major: {
      type: DataTypes.STRING,
      field: "member_major"
    },
    member_gender: {
      type: DataTypes.STRING,
      field: "member_gender"
    },
    member_race: {
      type: DataTypes.STRING,
      field: "member_race"
    },
    member_status: {
      type: DataTypes.STRING,
      field: "member_status"
    }
  },
  {
    timestamps: false,
  }
);

// ==============================
// Membership Model
// ==============================
const Membership = sequelize.define(
  "Membership",
  {
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
    org_role: {
      type: DataTypes.INTEGER, // 0 = Member, 1 = E-Board, 2 = Admin
      allowNull: false,
    },
    member_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    active_member: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);


const Attendance = sequelize.define(
  "Attendance", {
    attendance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attendance_status: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

const Event = sequelize.define(
  "Event", {
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
  },
  {
    timestamps: false,
  }
);

const Recognition = sequelize.define(
  "Recognition", {
    recognition_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recognition_year: DataTypes.INTEGER,
    recognition_type: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);


const MembershipRequirement = sequelize.define(
  "MembershipRequirement", {
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
  },
  {
    timestamps: false,
  }
);

const EmailSettings = sequelize.define(
  "EmailSettings", {
    email_setting: {
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
  },
  {
    timestamps: false,
  }
);

// Define associations

EmailSettings.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

MembershipRequirement.belongsTo(Organization, {
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

Recognition.belongsTo(Organization, {
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