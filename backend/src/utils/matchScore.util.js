exports.calculateMatchScore = (me, other) => {
  let score = 0;
  const common = [];

  // Budget overlap
  const budgetOverlap =
    me.budget_min <= other.budget_max &&
    other.budget_min <= me.budget_max;

  if (budgetOverlap) {
    score += 20;
    common.push("Budget");
  }

  // Sleep schedule
  if (me.sleep_schedule === other.sleep_schedule) {
    score += 15;
    common.push("Sleep Schedule");
  }

  // Cleanliness (difference <= 1)
  if (Math.abs(me.cleanliness_level - other.cleanliness_level) <= 1) {
    score += 15;
    common.push("Cleanliness");
  }

  // Food preference
  if (
    me.food_preference === other.food_preference ||
    me.food_preference === "ANY" ||
    other.food_preference === "ANY"
  ) {
    score += 10;
    common.push("Food Preference");
  }

  // Smoking
  if (me.smoking === other.smoking) {
    score += 20;
    common.push("Smoking");
  }

  // Study preference
  if (me.study_preference === other.study_preference) {
    score += 20;
    common.push("Study Preference");
  }

  return { score, common };
};
