const Profile = require("../Models/Profile");
const User = require("../Models/User");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");
const jwt = require("jsonwebtoken");
const course = require("../Models/Courses");
const {convertSecondsToDuration} = require("../Utils/secToDuration")
const CourseProgress = require("../Models/CourseProgress");


// (tested)
exports.updateProfile = async (req, res) => {
    // console.log(req.body);
    // console.log(req.token);
  try {
  
    
    const { dateOfBirth, contactNumber, gender, about = "" } = req.body;
    const id = req.user.id;

    if (!contactNumber || !gender || !id || !dateOfBirth) {
      return res.status(500).json({
        success: false,
        message: "All  fields are Required",
        error: err.message,w
      });
    }

    const userDetail = await User.findById(id);

    if (!userDetail) {
      console.log("---->User Details not present", userDetail);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let profileDetail;

    if (!userDetail.additionalDetails) {
      // No profile linked, create new profile
      profileDetail = new Profile({
        dateOfBirth,
        contactNumber,
        gender,
        about: about || "",
      });

      await profileDetail.save();

      // Link new profile to user and save user
      userDetail.additionalDetails = profileDetail._id;
      await userDetail.save();
    } else {
      // Profile exists, update it

      profileDetail = await Profile.findById(userDetail.additionalDetails);
      if (!profileDetail) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }
      profileDetail.dateOfBirth = dateOfBirth;
      profileDetail.about = about ? about : "";
      profileDetail.gender = gender;
      profileDetail.contactNumber = contactNumber;
      await profileDetail.save();
       userDetail.additionalDetails = profileDetail._id;
      await userDetail.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile Update Successfully",
      userDetail,
    });
  } catch (err) {
    console.log("Cannot Update  Profile --->", err);
    return res.status(500).json({
      success: false,
      message: "Cannot Update  Profile",
      error: err.message,
    });
  }
};

// (tested)
 exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    // Find user by ID
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile if additionalDetails is valid
    if (userDetails.additionalDetails) {
      await Profile.findByIdAndDelete(userDetails.additionalDetails);
    }

    // Delete user
    await User.findByIdAndDelete(id);

    // console.log("User Deleted Successfully");
    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (err) {
    console.error("Cannot Delete Profile", err);
    return res.status(500).json({
      success: false,
      message: "Cannot Delete Profile",
      error: err.message,
    });
  }
};

// (tested) 
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findOne({_id:id})
      .populate("additionalDetails")
      .exec();

    console.log("USer Details Fetched",userDetails);
     return res.status(200).json({
      success: true,
      message: " Fetch USer Details",
    
    });

  } catch (err) {
    console.log("Cannot Fetch USer Details", err);
    return res.status(500).json({
      success: false,
      message: "Cannot Fetch USer Details",
      error: err.message,
    });
  }
};

// (tested) will see this one more time
exports.updateDisplayPicture = async (req, res) => {
  console.log("--->-->"+req.body);
  try {
    const authHeader = req.header("Authorization");


    // const file = ; // gets the file attached under "imageFile"



const token = req.cookies.token
  || req.body.token 
  || (authHeader ? authHeader.replace("Bearer", "").trim() : null);

   
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token not found",
      });
    }
    //   // Decode the token to extract user information (using your secret key)
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    // const userId = req.user.id;
    console.log("---->", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    if (!req.formData.get('displayPicture')) {
      return res.status(400).json({
        success: false,
        message: "No display picture file provided",
      });
    }


    const displayPicture = req.formData.get('displayPicture')  

    const image = await uploadImageToCloudinary(
      displayPicture.tempFilePath,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    if (!image || !image.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found to update image",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image Updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message + "Internal Server Error",
    });
  }
};
 
// (Tested)
exports.instructorDashboard = async (req, res) => {
  try {
    // Fetch courses for the instructor
    const courseDetails = await course.find({ instructor: req.user.id });

    // Transform course details to include stats
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled?.length || 0;
      const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0);

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail, // Including thumbnail for UI
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    // Respond with the transformed course data
    res.status(200).json({
      success: true,
      message: "Fetch instructor dashboard",
      courseDetails: courseData,
    });
  } catch (error) {
    console.error("Error fetching instructor dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// (TEsted)
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
      .populate({
        path: "courses",
        populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
        },
      })
      .exec()

      userDetails = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetails.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetails.courses[i].courseContent[
			j
		  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetails.courses[i].courseContent[j].subSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }

      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};



// exports.getEnrolledCourses = async (req, res) => {
//     try {
//       const userId = req.user.id
//       let userDetails = await User.findOne({
//         _id: userId,
//       })
//       .populate({
//         path: "courses",
//         populate: {
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//         },
//       })
//       .exec()

//       userDetails = userDetails.toObject()
// 	  var SubsectionLength = 0
// 	  for (var i = 0; i < userDetails.courses.length; i++) {
// 		let totalDurationInSeconds = 0
// 		SubsectionLength = 0
// 		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
// 		  totalDurationInSeconds += userDetails.courses[i].courseContent[
// 			j
// 		  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
// 		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
// 			totalDurationInSeconds
// 		  )
// 		  SubsectionLength +=
// 			userDetails.courses[i].courseContent[j].subSection.length
// 		}
// 		let courseProgressCount = await CourseProgress.findOne({
// 		  courseID: userDetails.courses[i]._id,
// 		  userId: userId,
// 		})
// 		courseProgressCount = courseProgressCount?.completedVideos.length
// 		if (SubsectionLength === 0) {
// 		  userDetails.courses[i].progressPercentage = 100
// 		} else {
// 		  // To make it up to 2 decimal point
// 		  const multiplier = Math.pow(10, 2)
// 		  userDetails.courses[i].progressPercentage =
// 			Math.round(
// 			  (courseProgressCount / SubsectionLength) * 100 * multiplier
// 			) / multiplier
// 		}
// 	  }

//       if (!userDetails) {
//         return res.status(400).json({
//           success: false,
//           message: `Could not find user with id: ${userDetails}`,
//         })
//       }
//       return res.status(200).json({
//         success: true,
//         data: userDetails.courses,
//       })
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       })
//     }
// };


