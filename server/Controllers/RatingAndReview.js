const RatingAndReview = require("../Models/RatingAndReview");
const Courses = require("../Models/Courses");
// create rating
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // if user is enrolled or not
    const courseDetails = await Courses.findById(courseId);

    if (!courseDetails || !courseDetails.studentsEnrolled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in the course",
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "course is already reviewed",
      });
    }

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update course with the rating/review
    await Courses.findByIdAndUpdate(
      courseId,
      {
        $push: {
          RatingAndReview: ratingReview,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      data: ratingReview,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating Reviw",
    });
  }
};

// get avgrating

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    // Calculating Avg rating
    const result = await RatingAndReview.aggregate({
      $match: { course: courseId },
      $group: {
        _id: null, // Grouping is not necessary for specific course
        averageRating: { $avg: "$rating" }, // Calculate average of 'rating'
      },
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ratings found for this course",
      });
    }

    return res.status(200).json({
      success: true,
      averageRating: result[0].averageRating,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error .During Find Avereage rating",
    });
  }
};

// getAllrating

exports.getAllRating = async (req, res) => {
  try {
    const allReview = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "User",
        select: "firstName lastName email image",
      })
      .populate({
        path:"course",
        select:"courseName",
      })
      .exec()



    return res.status(200).json({
      success: true,
      message: "Fetched all ratings and reviews successfully.",
      data: allReviews,
    });
  } catch (err) {
    console.error("Error in getAllRating:", err);

    // Error response with a detailed message
    return res.status(500).json({
      success: false,
      message: "Internal server error in getAllRating function.",
    });
  }
};

// Creating review for course
exports.createReview = async (req, res) => {
  try {
    const { review, rating, courseId, userId } = req.body;

    if (!review || !courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Review, Course ID and User ID are required.",
      });
    }

    const courseDetails = await Courses.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }


    const isEnrolled = courseDetails.studentEnrolled.some((student) =>
      student.toString() === userId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in the course.",
      });
    }


    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed.",
      });
    }

    const ratingReview = await RatingAndReview.create({
      review,
      rating: rating || undefined,
      course: courseId,
      user: userId,
    });


    await Courses.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingReview._id },
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: ratingReview,
    });
  } catch (err) {
    console.error("Error in createReview:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getAllReviews = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      });

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (err) {
    console.error("Error in getAllReviews:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
