

import { useSelector } from "react-redux"
import frameImg from "../../../Assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import QuickLoginBox from "./QuickLoginBox " // 👈 import the box component


function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="relative grid min-h-[calc(100vh-3.5rem)] place-items-center ">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">

          {/* 👇 Floating Quick Login Box */}
          <div className="hidden md:block absolute right-[430px] top-[160px] z-30">
            <QuickLoginBox />
          </div>

          {/* LEFT: Form Section */}
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>

            {/* Show Login or Signup form */}
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>

          {/* RIGHT: Image Section */}
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              loading="lazy"
              className="absolute -top-5 right-4 z-10 w-[600px] h-[100%]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Template
