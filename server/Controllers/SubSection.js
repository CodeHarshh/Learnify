const subSection = require("../Models/SubSection");
const Section = require("../Models/Section");
const { uploadImageToCloudinary } = require("../Utils/imageUploader");
require("dotenv").config();

// (Tested)
// exports.createSubSection = async (req, res) => {
//   try {
//     const { sectionId, title, timeDuration, description } = req.body;
//     const video = req.files.videoFile;

//      if (!sectionId || !title || !timeDuration || !description || !video ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const uploadDetail = await uploadImageToCloudinary(
//       video,
//       process.env.FOLDER_NAME
//     );

//     const subSectionDetails = await subSection.create({
//       title: title,
//       timeDuration: timeDuration,
//       description: description,
//       videoUrl: uploadDetail.secure_url,
//     });

//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { $push: { subSection: subSectionDetails._id } },
//       { new: true }
//     ).populate("subSection");

//     res.status(200).json({
//       success: true,
//       message: "Subsection Created Successfully .",
//       data:updatedSection,
//     });
//   } catch (err) {
//     console.error("Error occurred while updating Sub Section", err);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong . while Updating Sub Section ",
//     });
//   }
// };

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;

    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload video
    const uploadDetail = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("Upload Details:", uploadDetail);

    // Create subsection
    const subSectionDetails = await subSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetail.secure_url,
    });
    console.log("SubSection Created:", subSectionDetails);

    // Update section with new subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");
    console.log("Updated Section:", updatedSection);

    res.status(200).json({
      success: true,
      message: "Subsection Created Successfully.",
      data: updatedSection,
    });
  } catch (err) {
    console.error("Error occurred while updating Sub Section", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating Sub Section.",
    });
  }
};


// (Tested)
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;

    if (!subSectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updatedSubSection = await subSection.findByIdAndUpdate(
      subSectionId,
      { title, timeDuration, description },
      { new: true }
    );

    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSubSection,
    });
  } catch (err) {
    console.error("Error while updating SubSection", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating SubSection",
    });
  }
};

// (Tested)
exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body;

    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and SubSection ID are required",
      });
    }

    // Remove SubSection reference from Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSections: subSectionId } },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete SubSection
    const deletedSubSection = await subSection.findByIdAndDelete(subSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (err) {
    console.error("Error while deleting SubSection", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting SubSection",
    });
  }
};
