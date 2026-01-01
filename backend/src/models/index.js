const sequelize = require("../config/database");

const User = require("./User");
const RoommateProfile = require("./RoommateProfile");
const RoommateMatch = require("./RoommateMatch");
const Hostel = require("./Hostel");

/* ================= ASSOCIATIONS ================= */

// User ↔ RoommateProfile (ONE TO ONE)
User.hasOne(RoommateProfile, {
  foreignKey: "user_id",
});
RoommateProfile.belongsTo(User, {
  foreignKey: "user_id",
});

// User ↔ RoommateMatch
User.hasMany(RoommateMatch, {
  foreignKey: "user_id",
});
User.hasMany(RoommateMatch, {
  foreignKey: "matched_user_id",
});

// User ↔ Hostel
User.hasMany(Hostel, {
  foreignKey: "owner_id",
});
Hostel.belongsTo(User, {
  foreignKey: "owner_id",
});

module.exports = {
  sequelize,
  User,
  RoommateProfile,
  RoommateMatch,
  Hostel,
};
