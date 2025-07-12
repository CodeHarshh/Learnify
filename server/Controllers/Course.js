const { isInstructor } = require("../Middlewares/auth");
const course = require("../Models/Courses");
const Category = require("../Models/Category");
const User = require("../Models/User");
const Section=require("../Models/Section")
const SubSection=require("../Models/SubSection")

const {
  UploadCloudinary,
  uploadImageToCloudinary,
} = require("../Utils/imageUploader");

// create course handler Function

// (Tested)
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatyouWillLearn,
      price,
      tag,
      category,
    } = req.body;
    const thumbnail = req.files.thumbnailImage;

    // Log the values for debugging

    if (
      !courseName ||
      !courseDescription ||
      !whatyouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    // console.log("Instructor Details: ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "instructorDetails not found",
      });
    }

    // check tag is valid or not

    const tagDetails = await Category.findOne({ name:category });
    // console.log("TagDetails Details: ", tagDetails);

    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create a entry for new course in Db
    const CategoryObj = await Category.findOne({ name: category });
    // console.log(CategoryObj);
if (!CategoryObj) {
 return res.status(404).json({
 success: false,
 message: "Category not found",
 });
}
const categoryId = CategoryObj._id;




    const newCourse = await course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatyouWillLearn: whatyouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
      category:categoryId
    });

    // add this course to  the instructor(user)
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
  categoryId,
  { $push: { course: newCourse._id } },
  { new: true }
);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create course ",
    });
  }
};

// (Tested)
exports.showAllcourses = async (req, res) => {
  try {
    const allCourses = await course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()



    return res.status(200).json({
      success: true,
      message: "Data for all Courses Fetched",
      data: allCourses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot Fetch Course data ",
      error: err.message,
    });
  }
};

function convertSecondsToDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
// (Tested)
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
     const courseDetails = await course.findOne({
      _id: courseId,
    })

      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .exec()



             // .populate({
      //   path: "instructor",
      //   populate: {
      //     path: "additionalDetails",
      //   },
      // })

       //   select: "videoUrl",


    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }


    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// (Tested)
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    // console.log("------->",req.body.id);
    const instructorId = req.body.id || req.user.id 

    if (!instructorId) {
  return res.status(400).json({
    success: false,
    message: "Instructor ID is required",
  });
}

    // Find all courses belonging to the instructor
    const instructorCourses = await course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// (Tested)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate courseId
    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: "Course ID is required" 
      });
    }

    // Find the course
    const currentCourse = await course.findById(courseId); // Renamed variable
    if (!currentCourse) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Unenroll students from the course
    const studentsEnrolled = currentCourse.studentEnrolled; // Fixed property name
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = currentCourse.courseContent; // Fixed property name
    for (const sectionId of courseSections) {
      // Find the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection; // Fixed property name
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

