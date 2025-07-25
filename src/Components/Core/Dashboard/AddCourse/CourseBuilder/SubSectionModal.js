
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "../../../../../Services/Opertaion/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../Common/IconBtn";
import Upload from "../Upload";



const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      // console.log("Modal data for edit/view", modalData)
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
 }, [view, edit, modalData.title, modalData.description, modalData.videoUrl, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();

    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues();
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData();
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }

    // console.log("Values After Editing form values:", formData)
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      console.log("Updated Course-------------:", updatedCourse);
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("videoFile", data.lectureVideo);
formData.append("timeDuration", "300");

    // const videoFile = data.lectureVideo[0]; // Assuming it's a file input

//         const getVideoDuration = (file) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const videoElement = document.createElement("video");
//       videoElement.preload = "metadata"; // Ensure metadata is loaded
//       videoElement.src = URL.createObjectURL(file);

//       videoElement.addEventListener("loadedmetadata", () => {
//         if (videoElement.duration) {
//           const duration = Math.round(videoElement.duration); // Duration in seconds
//           URL.revokeObjectURL(videoElement.src);
//           resolve(duration);
//         } else {
//           reject(new Error("Failed to get video duration from metadata."));
//         }
//       });

//       videoElement.addEventListener("error", () => {
//         reject(new Error("Error loading video file. Please check the format."));
//       });
//     } catch (error) {
//       reject(new Error("An unexpected error occurred."));
//     }
//   });
// };

    // try {
    //   const duration = await getVideoDuration(videoFile);
    //     formData.append("timeDuration", duration); // Append duration to FormData
    // } catch (error) {
    //   toast.error(error.message);
    //   setLoading(false);
    //   return;
    // }

    setLoading(true);
    let result;
    {
    const data=formData;
  result = await createSubSection(data, token);
    }

    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      console.log("=======>",updatedCourse);
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);

    // Helper function to get video duration


    // const getVideoDuration = (file) => {
    //   return new Promise((resolve, reject) => {
    //     const videoElement = document.createElement("video");
    //     videoElement.src = URL.createObjectURL(file);

    //     videoElement.addEventListener("loadedmetadata", () => {
    //       const duration = Math.round(videoElement.duration); // Duration in seconds
    //       URL.revokeObjectURL(videoElement.src);
    //       resolve(duration);
    //     });

    //     videoElement.addEventListener("error", (error) => {
    //       reject(error);
    //     });
    //   });
    // };
 

   };
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;
