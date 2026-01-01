const express = require("express");
const router = express.Router();

const { findMatches } = require("../controllers/roommateMatch.controller");
const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

router.get(
  "/",
  authenticate,
  authorize(["STUDENT"]),
  findMatches
);

module.exports = router;
