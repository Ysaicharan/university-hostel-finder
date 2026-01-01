const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostel.controller");
const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

// OWNER → add hostel
router.post(
  "/",
  authenticate,
  authorize(["OWNER"]),
  hostelController.createHostel
);

// STUDENT → view approved hostels
router.get(
  "/",
  authenticate,
  authorize(["STUDENT"]),
  hostelController.getApprovedHostels
);

// ADMIN → view pending hostels
router.get(
  "/pending",
  authenticate,
  authorize(["ADMIN"]),
  hostelController.getPendingHostels
);

// ADMIN → approve hostel
router.put(
  "/:id/approve",
  authenticate,
  authorize(["ADMIN"]),
  hostelController.approveHostel
);

module.exports = router;
