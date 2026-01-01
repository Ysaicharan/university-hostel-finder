const express = require("express");
const router = express.Router();

const {
  createOrUpdateProfile,
  getMyProfile,
} = require("../controllers/roommateProfile.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

router.post(
  "/",
  authenticate,
  authorize(["STUDENT"]),
  createOrUpdateProfile
);

router.get(
  "/me",
  authenticate,
  authorize(["STUDENT"]),
  getMyProfile
);

module.exports = router;
