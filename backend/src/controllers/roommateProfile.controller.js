const RoommateProfile = require("../models/RoommateProfile");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const existingProfile = await RoommateProfile.findByPk(userId);

    if (existingProfile) {
      await existingProfile.update(data);
      return res.json({ message: "Roommate profile updated successfully" });
    }

    await RoommateProfile.create({
      user_id: userId,
      ...data,
    });

    res.status(201).json({ message: "Roommate profile created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await RoommateProfile.findByPk(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
