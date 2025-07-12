const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllcourses,
  getCourseDetails,
  getInstructorCourses,deleteCourse
} = require("../Controllers/Course");

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,bestPickCourses,moreRecommendedCourses
} = require("../Controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../Controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../Controllers/SubSection");

const {
  createRating,
  getAllRating,
  getAverageRating,
  createReview,getAllReviews
} = require("../Controllers/RatingAndReview");

const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../Middlewares/auth");

// routes

// Course Routes
router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/course/all", showAllcourses);
router.post("/details", getCourseDetails);
router.post("/getInstructorCourses", getInstructorCourses);
router.post("/deleteCourse", deleteCourse);

// Category Routes
router.get("/showCategories", showAllCategories);
router.post("/createCategory", createCategory);
router.post("/getCategoryPageDetails", categoryPageDetails)
router.get("/bestPickCourses", bestPickCourses)
router.get("/moreRecommendedCourses", moreRecommendedCourses)

// Section Routes
router.post("/createSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

// Subsection Routes
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Rating and Review Routes
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAllRating", getAllRating);
router.get("/getAverageRating", getAverageRating);
router.post("/createReview", createReview);
router.get("/getAllReviews", getAllReviews);

module.exports = router;
