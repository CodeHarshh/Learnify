const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendOTP,
  forgotPassword,
} = require("../Controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../Controllers/ResetPassword");

const { auth } = require("../Middlewares/auth");

//    Authentication routes

router.post("/login", login);

router.post("/signup", signup);

router.post("/sendOtp", sendOTP);

router.post("/forgotPassword", auth, sendOTP, forgotPassword);

//  Reset Password

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);

module.exports = router;
