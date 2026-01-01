const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Otp = sequelize.define(
  "Otp",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otps",
    timestamps: false, // 🔥 THIS FIXES THE ERROR
  }
);

module.exports = Otp;
