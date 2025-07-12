import React from 'react'
import Intructorpng from "../../../Assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import Button from "../../../Components/Core/Button"
import { FaArrowRight } from "react-icons/fa";
const IntructorSection = ({text}) => {
  return (
<div className="flex flex-row gap-10 items w-11/12" >

    <div className='w-[50%] flex '>
        <div className='w-[85%] h-[90%] mt-10 ml-20 flex items-center justify-center' > 
            <img alt="Intructorpng" src={Intructorpng}></img></div>
      
    </div>

    <div className='w-[50%] flex flex-col gap-3 ml-10 mt-[10%]'>
    <div className='text-4xl w-[50%] font-bold' >
        Become an <HighlightText text={"Instructor"}></HighlightText>
    </div>

    <div className='w-[70%]'>
        Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
    </div>

      <Button active={true} linkto={"/signup"}>
                <div className="flex flex-row gap-2">
                  Start Learning Today
                  <FaArrowRight></FaArrowRight>
                </div>
              </Button>
 
        </div>

</div>
  )
}

export default IntructorSection