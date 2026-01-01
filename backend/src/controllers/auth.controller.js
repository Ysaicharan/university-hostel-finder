const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const Otp = require("../models/Otp");

const { sendOtp, verifyOtp } = require("../services/otp.service");
const { checkEmailExists } = require("../services/emailCheck.service");
const { verifyCaptcha } = require("../services/captcha.service");

/* ===========================
   REGISTER (PENDING USERS)
   =========================== */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, university, captchaToken } = req.body;

    // CAPTCHA
    await verifyCaptcha(captchaToken);

    if (role === "ADMIN") {
      return res.status(403).json({
        message: "Admin registration not allowed",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check email deliverability FIRST
    const isDeliverable = await checkEmailExists(email);
    if (!isDeliverable) {
      return res.status(400).json({
        message: "Email address does not exist or cannot receive emails",
      });
    }

    // Clear old pending records
    await PendingUser.destroy({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      role,
      university,
    });

    await sendOtp(email);

    return res.status(201).json({
      message: "OTP sent to email. Verify to complete registration.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

/* ===========================
   VERIFY OTP (CREATE USER)
   =========================== */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    await verifyOtp(email, otp);

    const pending = await PendingUser.findOne({ where: { email } });
    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found",
      });
    }

    await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
      university: pending.university,
      is_verified: true,
    });

    await PendingUser.destroy({ where: { email } });

    return res.json({
      message: "Email verified successfully. Account created.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

/* ===========================
   RESEND OTP (CAPTCHA + COOLDOWN)
   =========================== */
exports.resendOtp = async (req, res) => {
  try {
    const { email, captchaToken } = req.body;

    await verifyCaptcha(captchaToken);

    const pending = await PendingUser.findOne({ where: { email } });
    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found",
      });
    }

    const record = await Otp.findOne({ where: { email } });
    if (record) {
      const lastSent = new Date(record.sent_at).getTime();
      const diff = Math.floor((Date.now() - lastSent) / 1000);

      if (diff < 60) {
        return res.status(429).json({
          message: `Please wait ${60 - diff}s before resending OTP`,
        });
      }
    }

    await sendOtp(email);

    return res.json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

/* ===========================
   LOGIN
   =========================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        university: user.university,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      university: user.university,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

/* ===========================
   FORGOT PASSWORD (SEND OTP)
   =========================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, captchaToken } = req.body;

    await verifyCaptcha(captchaToken);

    const user = await User.findOne({ where: { email } });

    // Prevent email enumeration
    if (!user) {
      return res.json({
        message: "If the email exists, an OTP has been sent",
      });
    }

    await Otp.destroy({ where: { email } });

    await sendOtp(email);

    return res.json({
      message: "If the email exists, an OTP has been sent",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

/* ===========================
   RESET PASSWORD
   =========================== */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    await verifyOtp(email, otp);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      { where: { email } }
    );

    return res.json({
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
