const Category = require("../Models/Category");
const Course = require("../Models/Courses");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// (Tested)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // Create entry in DB
    const categoryDetails = await Category.create({
      name,
      description,
    });
    // console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (err) {
    console.error("Error in category controller:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      data: categoryDetails, 
    });
  }
};

// (Tested)
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true })
    // .populate({ path: "course"})
    return res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      data: allCategories,
    });
  } catch (err) {
    console.error(
      "Error in category controller while showing all categories:",
      err
    );
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


 // (Tested)
exports.categoryPageDetails = async (req,res) => {
    try {
        const { categoryId } = req.body
      // console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCourses = await Category.findById(categoryId)
        .populate({
          path: "course",
          // match: { status: "Published" },
          // populate: "ratingAndReviews",
        })
        .exec()
  
      // console.log("SELECTED COURSE", selectedCourses)
      // Handle the case when the category is not found
      if (!selectedCourses) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }

      // console.log(selectedCourses);

      // Handle the case when there are no courses
      if (selectedCourses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
        course: { $not: { $size: 0 } }
      })
      // console.log("categoriesExceptSelected", categoriesExceptSelected)

      let differentCourses = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id).populate({
          path: "course",
          // match: { status: "Published" },
        })
        .exec()
        //console.log("Different COURSE", differentCourses)
      // Get top-selling courses across all categories
      const allCategories = await Category.find({}).populate({
          path: "course",
          // match: { status: "Published" },
         
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = await Course.find({ status: 'Published' })
      .sort({ "studentsEnrolled.length": -1 }).populate("ratingAndReviews") // Sort by studentsEnrolled array length in descending order
      .exec();

        res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses,
            name: selectedCourses.name,
            description: selectedCourses.description,
            success:true
		})
    } catch (error) {
        return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}


// exports.bestPickCourses = async (req, res) => {
//   try {
//     const categories = await Category.find({})
//       .populate({
//         path: "course"
//         // ,
//         // match: { status: "Published" }, // Optional: only include published courses
//       })
//       .exec();

//     const bestPicks = [];

//     categories.forEach((category) => {
//       // Filter out empty categories
//       if (category.course && category.course.length > 0) {
//         // Shuffle courses and pick 2 (or less if not enough)
//         const shuffled = category.course.sort(() => 0.5 - Math.random());
//         const selectedCourses = shuffled.slice(0, 2); // pick 2 random
//         bestPicks.push(...selectedCourses);
//       }
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Best pick courses from all categories",
//       data: bestPicks,
//     });
//   } catch (error) {
//     console.error("Error fetching best pick courses:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch best pick courses",
//       error: error.message,
//     });
//   }
// };

// exports.moreRecommendedCourses = async (req, res) => {
//   try {
//     const { excludeCourseIds = [] } = req.body;

//     const categories = await Category.find({})
//       .populate("course")
//       .exec();

//     const additionalPicks = [];

//     categories.forEach((category) => {
//       if (category.course && category.course.length > 0) {
//         const filtered = category.course.filter(
//           (c) => !excludeCourseIds.includes(c._id.toString())
//         );

//         const shuffled = filtered.sort(() => 0.5 - Math.random());
//         const selected = shuffled.slice(0, 2);

//         additionalPicks.push(...selected);
//       }
//     });

//     return res.status(200).json({
//       success: true,
//       message: "More recommended courses (excluding already shown ones)",
//       data: additionalPicks,
//     });
//   } catch (error) {
//     console.error("Error fetching more courses:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch more recommended courses",
//       error: error.message,
//     });
//   }
// };



let cachedBestPickCourseIds = [];

// ✅ Best Pick Courses
exports.bestPickCourses = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("course")
      .exec();

    const bestPicks = [];

    categories.forEach((category) => {
      if (category.course && category.course.length > 0) {
        const shuffled = category.course.sort(() => 0.5 - Math.random());
        const selectedCourses = shuffled.slice(0, 2);
        bestPicks.push(...selectedCourses);
      }
    });

    // Save the IDs in memory to exclude later
    cachedBestPickCourseIds = bestPicks.map((c) => c._id.toString());

    return res.status(200).json({
      success: true,
      message: "Best pick courses from all categories",
      data: bestPicks,
    });
  } catch (error) {
    console.error("Error fetching best pick courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch best pick courses",
      error: error.message,
    });
  }
};

// ✅ More Recommended Courses
exports.moreRecommendedCourses = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("course")
      .exec();

    const additionalPicks = [];

    categories.forEach((category) => {
      if (category.course && category.course.length > 0) {
        const filtered = category.course.filter(
          (c) => !cachedBestPickCourseIds.includes(c._id.toString())
        );

        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);
        additionalPicks.push(...selected);
      }
    });

    return res.status(200).json({
      success: true,
      message: "More recommended courses (excluding best picks)",
      data: additionalPicks,
    });
  } catch (error) {
    console.error("Error fetching more courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch more recommended courses",
      error: error.message,
    });
  }
};