const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RoommateProfile = sequelize.define(
  "RoommateProfile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    budget_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    budget_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sleep_schedule: {
      type: DataTypes.ENUM("EARLY", "LATE"),
      allowNull: false,
    },

    cleanliness_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    smoking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    drinking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    study_preference: {
      type: DataTypes.ENUM("QUIET", "FLEXIBLE"),
      allowNull: false,
    },

    food_preference: {
      type: DataTypes.ENUM("VEG", "NON_VEG", "ANY"),
      allowNull: false,
    },
  },
  {
    tableName: "roommate_profiles",
    timestamps: false,
  }
);

module.exports = RoommateProfile;
