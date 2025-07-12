import React from "react";
import { Link } from "react-router-dom";

function Button({ children, active, linkto }) {
  return (
    <div>
      <Link to={linkto}>
        <button
          className={`text-center text-[13px] px-6 py-3 rounded-md font-bold shadow-[rgba(0,0,0,0.2)_0_4px_12px] transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white"
              : "bg-richblack-800 text-richblack-300"
          } hover:scale-95`}
        >
          {children}
        </button>
      </Link>
    </div>
  );
}

export default Button;
