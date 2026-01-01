const Hostel = require("../models/Hostel");
const User = require("../models/User");
const { Op } = require("sequelize");

/* =================================================
   OWNER: CREATE HOSTEL (PENDING APPROVAL)
   ================================================= */
exports.createHostel = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Fetch owner to get university
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const {
      name,
      address,
      price,
      rooms_available,
      distance_from_university,
    } = req.body;

    // Validate input
    if (
      !name ||
      !address ||
      !price ||
      !rooms_available ||
      !distance_from_university
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hostel = await Hostel.create({
      owner_id: ownerId,
      university: owner.university, // 🔥 IMPORTANT FIX
      name,
      address,
      price,
      rooms_available,
      distance_from_university,
      approved: false,
    });

    return res.status(201).json({
      message: "Hostel submitted for approval",
      hostel,
    });
  } catch (error) {
    console.error("CREATE HOSTEL ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

/* =================================================
   STUDENT: GET APPROVED HOSTELS
   ================================================= */
exports.getApprovedHostels = async (req, res) => {
  try {
    const { maxPrice } = req.query;
    const university = req.user.university;

    const where = {
      approved: true,
      university,
    };

    if (maxPrice) {
      where.price = { [Op.lte]: maxPrice };
    }

    const hostels = await Hostel.findAll({ where });

    return res.json(hostels);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* =================================================
   OWNER: GET OWN HOSTELS
   ================================================= */
exports.getOwnerHostels = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const hostels = await Hostel.findAll({
      where: { owner_id: ownerId },
    });

    return res.json(hostels);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* =================================================
   ADMIN: GET PENDING HOSTELS
   ================================================= */
exports.getPendingHostels = async (req, res) => {
  try {
    const hostels = await Hostel.findAll({
      where: { approved: false },
    });

    return res.json(hostels);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* =================================================
   ADMIN: APPROVE HOSTEL
   ================================================= */
exports.approveHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByPk(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    hostel.approved = true;
    await hostel.save();

    return res.json({
      message: "Hostel approved successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
