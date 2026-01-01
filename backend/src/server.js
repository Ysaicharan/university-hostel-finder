require("dotenv").config();
require("./models");
const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    await sequelize.sync();
    console.log("✅ Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
})();
