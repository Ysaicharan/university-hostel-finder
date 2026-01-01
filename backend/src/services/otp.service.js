const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Otp = require("../models/Otp");

/* ===========================
   MAIL TRANSPORT
   =========================== */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ✅ FIXED
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===========================
   SEND OTP
   =========================== */
exports.sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Remove previous OTP
  await Otp.destroy({ where: { email } });

  // Store new OTP
  await Otp.create({
    email,
    otp: hashedOtp,
    expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    sent_at: new Date(),
  });

  await transporter.sendMail({
    from: `"University Hostel Finder" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Account",
    html: `
      <h2>Email Verification</h2>
      <h1 style="letter-spacing:3px">${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};

/* ===========================
   VERIFY OTP
   =========================== */
exports.verifyOtp = async (email, otp) => {
  const record = await Otp.findOne({
    where: {
      email,
      expires_at: { [Op.gt]: new Date() },
    },
  });

  if (!record) {
    throw new Error("Invalid or expired OTP");
  }

  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  await Otp.destroy({ where: { email } });
};
