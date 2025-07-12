const Section = require("../Models/Section");
const Course = require("../Models/Courses");
const { status } = require("init");

//(Tested)
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required",
      });
    }

    const newSection = await Section.create({ sectionName });
 const updatedCourseDetail = await Course.findByIdAndUpdate(
  courseId,
  {
    $push: { courseContent: newSection._id },
  },
  { new: true } // Ensure this is part of the `findByIdAndUpdate` options
).populate({
  path: "courseContent",
  populate: {
    path: "subSection",
  },
});

    return res.status(201).json({
      success: true,
      message: "Section created and added to the course successfully",
      course: updatedCourseDetail,
    });
  } catch (err) {
    console.error("Error in createSection:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Unable to Create Section.",
    });
  }
};

//(Tested)
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (err) {
    console.log("Err occured while upadtingsection", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong . while Updating Section ",
    });
  }
};

// (Tested)
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.body;

    await Section.findByIdAndDelete(sectionId);
    console.log("Section deleted successfully");
    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (err) {
    console.log("Err occured while deleting section", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong . while deleting Section ",
    });
  }
};
