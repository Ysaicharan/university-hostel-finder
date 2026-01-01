const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("STUDENT", "OWNER", "ADMIN"),
      defaultValue: "STUDENT",
    },

    university: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ✅ NEW FIELD (OTP SUPPORT)
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = User;
