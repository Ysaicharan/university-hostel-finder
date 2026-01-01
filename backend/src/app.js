const roommateProfileRoutes = require("./routes/roommateProfile.routes");
const roommateMatchRoutes = require("./routes/roommateMatch.routes");
const hostelRoutes = require("./routes/hostel.routes");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roommate-profile", roommateProfileRoutes);
app.use("/api/roommate-match", roommateMatchRoutes);
app.use("/api/hostels", hostelRoutes);


app.get("/", (req, res) => {
  res.send("University Hostel Finder API is running");
});

module.exports = app;
