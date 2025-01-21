const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "membertracker",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost", // Or your MariaDB host
    dialect: "mariadb",
    logging: false, // Optional: Disable logging for cleaner output
  }
);

// Define models
const Organization = sequelize.define("Organization", {
  organization_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  organization_name: DataTypes.STRING,
  organization_description: DataTypes.STRING,
  organization_color: DataTypes.STRING,
});

const Member = sequelize.define("Member", {
  member_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  member_name: DataTypes.STRING,
  member_email: DataTypes.STRING,
  member_personal_email: DataTypes.STRING,
  member_phone_number: DataTypes.STRING,
  member_graduation_date: DataTypes.DATE,
  member_tshirt_size: DataTypes.STRING,
  member_major: DataTypes.STRING,
  member_gender: DataTypes.INTEGER,
  member_race: DataTypes.STRING,
});

const Membership = sequelize.define("Membership", {
  membership_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  role: DataTypes.INTEGER,
});

const Attendance = sequelize.define("Attendance", {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  event_id: DataTypes.INTEGER,
  attendance_status: DataTypes.INTEGER,
});

const Recognition = sequelize.define("Recognition", {
  recognition_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  recognition_year: DataTypes.INTEGER,
  recognition_type: DataTypes.INTEGER,
});

// Define associations
Member.hasMany(Membership, { foreignKey: "member_id" });
Membership.belongsTo(Member);

Organization.hasMany(Membership, { foreignKey: "organization_id" });
Membership.belongsTo(Organization);

Member.hasMany(Attendance, { foreignKey: "member_id" });
Attendance.belongsTo(Member);

Member.hasMany(Recognition, { foreignKey: "member_id" });
Recognition.belongsTo(Member);

// Synchronize models with the database (create tables)
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Tables created successfully!");
  })
  .catch((err) => {
    console.error("Unable to create tables:", err);
  });

module.exports = {
  sequelize,
  Organization,
  Member,
  Attendance,
  Recognition,
};
