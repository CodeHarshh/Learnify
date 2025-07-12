const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Profile",
    default:null,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  image: {
    type: String,
    // required: true,
  },
  token: {
    type: String,
     default:null,
  },
  resetPasswordExpires: {
    type: Date,
    default:null,
  },
  courseProgess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgess",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
