const { Op } = require("sequelize");
const User = require("../models/User");
const RoommateProfile = require("../models/RoommateProfile");

exports.findMatchesForUser = async (userId, university) => {
  // 1️⃣ Get current user's roommate profile
  const currentProfile = await RoommateProfile.findOne({
    where: { user_id: userId },
  });

  // If user has no profile, no matches
  if (!currentProfile) {
    return [];
  }

  // 2️⃣ Fetch ALL other profiles + user info
  const profiles = await RoommateProfile.findAll({
    where: {
      user_id: { [Op.ne]: userId },
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "university"],
      },
    ],
  });

  const matches = [];

  // 3️⃣ Matching logic
  for (const profile of profiles) {
    // 🚫 SAFETY CHECK (VERY IMPORTANT)
    if (!profile.User) continue;

    // 🚫 UNIVERSITY FILTER (USE JWT VALUE)
    if (profile.User.university !== university) continue;

    let score = 0;
    const common = [];

    // Budget overlap
    if (
      profile.budget_min <= currentProfile.budget_max &&
      profile.budget_max >= currentProfile.budget_min
    ) {
      score += 20;
      common.push("Budget");
    }

    // Sleep schedule
    if (profile.sleep_schedule === currentProfile.sleep_schedule) {
      score += 15;
      common.push("Sleep Schedule");
    }

    // Cleanliness
    if (
      Math.abs(
        profile.cleanliness_level -
          currentProfile.cleanliness_level
      ) <= 1
    ) {
      score += 15;
      common.push("Cleanliness");
    }

    // Food
    if (profile.food_preference === currentProfile.food_preference) {
      score += 10;
      common.push("Food Preference");
    }

    // Smoking
    if (profile.smoking === currentProfile.smoking) {
      score += 20;
      common.push("Smoking");
    }

    // Study preference
    if (profile.study_preference === currentProfile.study_preference) {
      score += 20;
      common.push("Study Preference");
    }

    //if (score > 0) {
      matches.push({
        user_id: profile.user_id,
        name: profile.User.name,
        score,
        common_preferences: common,
      });
    //}
  }

  // 4️⃣ Sort & limit
  matches.sort((a, b) => b.score - a.score);

  return matches.slice(0, 5);
};
