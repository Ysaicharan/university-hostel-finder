const { findMatchesForUser } = require("../services/roommateMatch.service");

exports.findMatches = async (req, res) => {
  console.log("REQ.USER =", req.user);
  try {
    const userId = req.user.id;
    const university = req.user.university;

    const matches = await findMatchesForUser(userId, university);

    res.json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
