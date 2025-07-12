import React from 'react'
import HighlightText from './HighlightText';
import know_your_progrerss from '../../../Assets/Images/Know_your_progress.svg'
import compare_with_other  from '../../../Assets/Images/Compare_with_others.svg'
import plan_your_lesson from '../../../Assets/Images/Plan_your_lessons.svg'
import  CTAButton from "../Button"
 
const LearnigLanguageSection = ({text}) => {
  return (
<div className='mt-[150px] w-11/12'>
    
    <div className="flex flex-col gap justify-center items-center  ">
       
       <div className='text-4xl font-semibold text-center'>
        You Swiss Knife for
        <HighlightText text={"learning any language"}></HighlightText>
       </div>

       <div className='flex text-center text-richblack-600 mx-auto w-[50%]'>
      Spin simplifies learning multiple languages with 20+ realistic voice-over options, progress tracking, personalized schedules, and more.
       </div>
       
       <div className='flex flex-row items-center relative  justify-between mt-5 w-[80%] '>
       {/* <img  className="object-contain relative left-[90px] h-[45%] w-[45%]" src={know_your_progrerss}/>
       <img  className="object-contain relative right-[50px]  h-[45%] w-[45%]" src={compare_with_other}/>
       <img className="object-contain relative right-[270px] mr-[100px] h-[55%] w-[55%]"  src={plan_your_lesson}/> */}
       <img
  className="object-contain relative left-[90px] h-[45%] w-[45%]"
  src={know_your_progrerss}
  alt="Know Your Progress"
/>
<img
  className="object-contain relative right-[50px] h-[45%] w-[45%]"
  src={compare_with_other}
  alt="Compare with Others"
/>
<img
  className="object-contain relative right-[270px] mr-[100px] h-[55%] w-[55%]"
  src={plan_your_lesson}
  alt="Plan Your Lesson"
/>

     

        </div>

        <div>
            <CTAButton active={true} linkto={"/signup"} >
            Leran more</CTAButton>
        </div>

    </div>

</div>
  )
}

export default LearnigLanguageSection;