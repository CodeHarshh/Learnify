
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../Services/Opertaion/authApi";
const QuickLoginBox = () => {
  const navigate = useNavigate();
 const dispatch = useDispatch()
const handleQuickLogin = async (role) => {
    
  const credentials = {
   instructor: {
    email: process.env.REACT_APP_INSTRUCTOR_EMAIL,
    password: process.env.REACT_APP_INSTRUCTOR_PASSWORD,
  },
  student: {
    email: process.env.REACT_APP_STUDENT_EMAIL,
    password: process.env.REACT_APP_STUDENT_PASSWORD,
  },
  };

  const { email, password } = credentials[role];
  dispatch(login(email, password, navigate));
};


  return (
    <div className="relative w-64 h-64 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center gap-6 p-4 ">
      {/* 🔵 Blue "pin"/corner ribbon in top-left */}
      <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-blue-600 border-r-transparent rounded-tl-lg"></div>

      <h2 className="text-xl font-extrabold text-teal-600 tracking-wide uppercase">
        Quick Access
      </h2>

      

      {/* 🎯 Gradient Button for Instructor */}
      <button
        onClick={() => handleQuickLogin("instructor")}
        className="w-full py-2 px-4 text-white rounded shadow-[rgba(0,0,0,0.2)_0_4px_12px] bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] hover:scale-105 active:scale-95 transition-transform duration-300"
      >
        Login as Instructor
      </button>

      {/* 🎯 Gradient Button for Student */}
      <button
        onClick={() => handleQuickLogin("student")}
        className="w-full py-2 px-4 text-white rounded shadow-[rgba(0,0,0,0.2)_0_4px_12px] bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] hover:scale-105 active:scale-95 transition-transform duration-300"
      >
        Login as Student
      </button>
    </div>
  );
};

export default QuickLoginBox;
