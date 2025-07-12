// import CTAButton from "../Button.jsx";
// import HighlightText from "./HighlightText.jsx"
// import { FaArrowRight } from "react-icons/fa";
// import { TypeAnimation } from "react-type-animation";

// function CodeBlocks({
//   position,
//   heading,
//   subheading,
//   ctabtn1,
//   ctabtn2,
//   codeblock,
//   bgGradient,
//   codeColor,
// }) {
//   return (
//     <div className={`flex ${position} my-20 flex  flex-col ml-6 gap-2 w-[100%] px-7 justify-center`}>


//       {/*Section 1*/}
//       <div className="w-[100%] lg:w-[50%] flex flex-col  text-white pt-1">
        
//       <div className="text-[6px]">{heading}</div>

//         <div className="text-richblack-300 text-base font-bold w-[85%] mt-3 ">
//           {subheading}
//         </div>

//         <div className="flex gap-7 mt-7">
//           <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
//             <div className="flex gap-2 items-center">
//               {ctabtn1.btnText}
//               <FaArrowRight />
//             </div>
//           </CTAButton>

//           <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
//             {ctabtn2.btnText}
//           </CTAButton>
//         </div>
//       </div>

//       {/*Section 2*/}
//       <div className=" code-border flex py-6 text-[7p] sm:text-xs  leading-[18px] sm:leading-6 w-[40%] h-[10%]  mr-[100px] justify-centerborder-e border-e-richblack-400">
//         {/*HW -> BG gradient*/}
//         <div
//           className="absolute gradient-custom
//         w-[373px] h-[257px] rounded-full blur-2xl opacity-20 -left-2 -top-2"
//         ></div>
//         <div
//           className="text-center flex select-none flex-col w-[10%]
//          text-richblack-400 font-inter font-bold"
//         >
//           <p>1</p>
//           <p>2</p>
//           <p>3</p>
//           <p>4</p>
//           <p>5</p>
//           <p>6</p>
//           <p>7</p>
//           <p>8</p>
//           <p>9</p>
//           <p>10</p>
 
      
//         </div>

//         <div
//           className={`w-[90%] flex flex-col gap-2 font-bold 
//         font-mono ${codeColor} pr-1`}
//         >
//           <TypeAnimation
//             sequence={[codeblock, 2000, ""]}
//             repeat={Infinity}
//             cursor={true}
//            speed={80} // Typing speed
//   deletionSpeed={120} // Deletion speed
//             style={{
//               whiteSpace: "pre-line",
//               display: "block",
//             }}
//             omitDeletionAnimation={true}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CodeBlocks;

// import CTAButton from "../Button.jsx";
// import HighlightText from "./HighlightText.jsx";
// import { FaArrowRight } from "react-icons/fa";
// import { TypeAnimation } from "react-type-animation";

// function CodeBlocks({
//   position,
//   heading,
//   subheading,
//   ctabtn1,
//   ctabtn2,
//   codeblock,
//   bgGradient,
//   codeColor,
// }) {
//   return (
//     <div
//       className={`flex ${position} my-20 flex-col gap-8 px-6 justify-center`}
//     >
//       {/* Section 1 */}
//       <div className="w-full lg:w-[50%] flex flex-col text-white">
//         <div className="text-sm font-semibold">{heading}</div>
//         <div className="text-richblack-300 text-sm font-medium mt-3">
//           {subheading}
//         </div>

//         <div className="flex gap-4 mt-6">
//           <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
//             <div className="flex gap-2 items-center">
//               {ctabtn1.btnText}
//               <FaArrowRight />
//             </div>
//           </CTAButton>
//           <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
//             {ctabtn2.btnText}
//           </CTAButton>
//         </div>
//       </div>

//       {/* Section 2 */}
//       <div
//         className={`relative flex py-4 text-[10px] sm:text-xs leading-5 w-full lg:w-[400px] bg-richblack-900 rounded-md shadow-lg transition-all duration-300`}
//         style={{
//           border: "1px solid transparent",
//           backgroundImage:
//             "linear-gradient(rgb(33, 33, 33), rgb(33, 33, 33)), linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3))",
//           backgroundOrigin: "border-box",
//           backgroundClip: "content-box, border-box",
//         }}
//       >
//         {/* Background Gradient */}
//         <div
//           className={`absolute ${bgGradient} w-[350px] h-[250px] rounded-full blur-2xl opacity-20 -left-4 -top-4`}
//         ></div>

//         {/* Line Numbers */}
//         <div className="text-center flex select-none flex-col w-[10%] text-richblack-400 font-mono">
//           {Array.from({ length: 10 }, (_, i) => (
//             <p key={i}>{i + 1}</p>
//           ))}
//         </div>

//         {/* Code Block */}
//         <div
//           className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-4`}
//         >
//           <TypeAnimation
//             sequence={[codeblock, 2000, ""]}
//             repeat={Infinity}
//             cursor={true}
//             speed={80} // Typing speed
//             deletionSpeed={120} // Deletion speed
//             style={{
//               whiteSpace: "pre-line",
//               display: "block",
//             }}
//             omitDeletionAnimation={true}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CodeBlocks;



import CTAButton from "../Button.jsx";

import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

function CodeBlocks({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  bgGradient,
  codeColor,
}) {
  return (
    <div
      className={`flex ${position} my-20 flex-col gap-8 px-6 justify-center`}
    >
      {/* Section 1 */}
      <div className="w-full lg:w-[50%] flex flex-col text-white">
        <div className="text-lg font-semibold">{heading}</div>
        <div className="text-richblack-300 text-base font-medium mt-3">
          {subheading}
        </div>

        <div className="flex gap-4 mt-6">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2 */}
      <div
        className={`relative flex py-4 text-[10px] sm:text-xs leading-5 w-full lg:w-[400px] rounded-md shadow-lg transition-all duration-300`}
        style={{
          backgroundColor: "#1a1f36", // Dark navy blue background
          backgroundImage: "linear-gradient(145deg, #1f273e, #121829)", // Subtle gradient
          color: "white", // Text color
          border: "1px solid #2a2f4a", // Border to complement the background
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)", // Soft shadow for depth
        }}
      >
        {/* Background Gradient */}
        <div
          className={`absolute ${bgGradient} w-[350px] h-[250px] rounded-full blur-2xl opacity-20 -left-4 -top-4`}
        ></div>

        {/* Line Numbers */}
        <div className="text-center flex select-none flex-col w-[10%] text-gray-400 font-mono">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i}>{i + 1}</p>
          ))}
        </div>

        {/* Code Block */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-4`}
        >
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
            speed={80} // Typing speed
            deletionSpeed={120} // Deletion speed
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeBlocks;

