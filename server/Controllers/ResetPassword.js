const User = require("../Models/User");
const OTP = require("../Models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../Utils/MailSender");
const crypto = require("crypto");


//Tested
exports.resetPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.json({
        success: false,
        message: "Your Email is not Registerd with us",
      });
    }

    const token = crypto.randomUUID();
    console.log("token", token);

    const updatedDetails = await User.findOne({ email: email });
    if (!updatedDetails) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    (updatedDetails.token = token),
      (updatedDetails.resetPasswordExpires = Date.now() + 10 * 60 * 1000),
      await updatedDetails.save();


    const url = `http://localhost:5000/update-password/${token}`;

    await mailSender({
      to: email,
      subject: "Reset Password",
      text: `Click the link to reset password: ${url}`,
    });

    return res.json({
      success: true,
      message: "Reset password link has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

//Tested
exports.resetPassword = async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords and confirmPassword  do not match.",
    });
  }

  try {
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Check if token is expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired for reset password. ",
      });
    }
    const hashedPAssword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPAssword, resetPasswordExpires: null, token: null },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Try again later.",
    });
  }
};
