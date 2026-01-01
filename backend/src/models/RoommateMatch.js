const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RoommateMatch = sequelize.define(
  "RoommateMatch",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matched_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "roommate_matches",
    timestamps: true,
  }
);

module.exports = RoommateMatch;
