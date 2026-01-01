const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Hostel = sequelize.define(
  "Hostel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    university: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    distance_from_university: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rooms_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "hostels",
    timestamps: true,
  }
);

module.exports = Hostel;
