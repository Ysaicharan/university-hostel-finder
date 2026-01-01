const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PendingUser = sequelize.define(
  "PendingUser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    role: DataTypes.ENUM("STUDENT", "OWNER"),
    university: DataTypes.STRING,
  },
  {
    tableName: "pending_users",
    timestamps: false,
  }
);

module.exports = PendingUser;
