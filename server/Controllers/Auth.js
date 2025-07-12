const User = require("../Models/User");
const OTP = require("../Models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../Models/Profile")
const { isNonNullObject } = require("razorpay/dist/utils/razorpay-utils");
require("dotenv").config();

// send otp (Tested)

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // otp generation

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated: ", otp);

    const result = await OTP.findOne({ otp: otp });

    while (result) {
      // If otp present it will generate again
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPaylod = { email, otp };

    //Create an entry for OTP

    const otpBody = await OTP.create(otpPaylod);
    console.log(otpPaylod);

    res.status(200).json({
      success: true,
      message: "OTP Sent Succesfully",
    });
  } catch (err) {
    console.log("Error Occured wile sending otp ", err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

// signUp (Tested)

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }
    //checking if user exists or not

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist.",
      });
    }

    // validate Account type or role
    if (
      accountType &&
      !["Admin", "Student", "Instructor"].includes(accountType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Recect OTP
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    console.log("recent otp---->", recentOtp);
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "Otp not found.",
      });
    }

    // Validate OTP
    if (recentOtp.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

       const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
        additionalDetails: profileDetails._id,
       image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: newUser._id,
        email: newUser.email,
        accountType: newUser.accountType,
      },
    });
  } catch (err) {
    console.error(
      `Internal Server Error during signup for email ${req.body?.email}: `,
      err
    );
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};

// Login  (Tested)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter the Credentials",
      });
    }

    // console.log(email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: email }).populate("additionalDetails");
    // console.log("---->", existingUser);

    const payload = {
      email: existingUser.email,
      id: existingUser._id,
      accountType: existingUser.accountType,
    };

    if (existingUser) {
      if (await bcrypt.compare(password, existingUser.password)) {
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        const user = existingUser.toObject();

        user.token = token;
        user.password = undefined;

        const option = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        };

        // console.log("->>>>>", user);

        res.cookie("token", token, option).status(200).json({
          success: true,
          token,
          user,
          message: "Successfully logged in",
        });
      }
      /// user exist but worng password
      else {
        return res.status(400).json({
          success: false,
          message: "wrong password",
        });
      }
    } // if user not exist
    else {
      return res.status(400).json({
        success: false,
        message: "User is not register",
      });
    }
  } catch (err) {
    console.log("Signup Error:", err);
    return res.status(500).json({
      success: false,
      message: `Internal server error during login: ${err.message}`,
    });
  }
};

// forgot pass (not verifired)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    // Check if all fields are provided
    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with the provided email does not exist.",
      });
    }

    // Find the most recent OTP for the given email
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email.",
      });
    }

    // Validate the OTP
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Optionally, delete the used OTP
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Password has been successfully updated.",
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
