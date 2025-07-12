import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constant";
import { addToCart } from "../../../slices/cartSlice";


const CourseDetailsCard = ({ course, setConfirmationModal, handleBuyCourse }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Instructors cannot buy courses.");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add to cart",
      btn1text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  return (
<div className="w-[90%] max-w-[400px] mx-auto bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 p-4 sm:p- sm:w-[300px]">


      {/* Thumbnail */}
      <img
        src={ThumbnailImage}
        alt="Course Thumbnail"
        className="w-full h-[200px] object-cover rounded-md sm:h-[130px]"
      />

      {/* Price */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">Course Price</h3>
        <p className="text-3xl font-bold text-purple-700">Rs. {CurrentPrice}</p>
        <hr className="my-3 border-gray-300" />
      </div>

      {/* Course Includes */}
      {/* <div className="text-sm">
        <h4 className="font-semibold mb-2 text-gray-700">This Course Includes:</h4>
        {Array.isArray(course.instructions) && course.instructions.length > 0 ? (
          course.instructions.map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-600 mb-1">
              <BiSolidRightArrow className="mt-1 text-purple-600" />
              <span>{item}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No instructions available.</p>
        )}
      </div> */}

      {/* Buttons */}
<div className="mt-5 space-y-2">
  <button

  className="w-full bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white py-2 sm:py-2 text-sm sm:text-base rounded-md font-bold shadow-md hover:scale-95 transition-all duration-200"
    onClick={
      user && course?.studentEnrolled.includes(user?._id)
        ? () => navigate("/dashboard/enrolled-courses")
        : handleBuyCourse
    }
  >
    {user && course?.studentEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"}
  </button>

  {!course?.studentEnrolled.includes(user?._id) && (
    <button
      className="w-full border border-[#4a00e0] text-[#4a00e0] py-2 rounded-md hover:bg-[#f0ecff] transition"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  )}
</div>



      {/* Share Button */}
      <div className="text-center mt-4">
        <button
          className="text-sm text-blue-500 underline hover:text-blue-700"
          onClick={handleShare}
        >
          Share this course
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
