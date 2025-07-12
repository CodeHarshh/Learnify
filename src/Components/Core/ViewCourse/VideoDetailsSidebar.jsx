import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../Common/IconBtn';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData } from '../../../slices/viewCourseSlice';
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"

const VideoDetailsSidebar = ({ setReviewModal, isMobile = false }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId, subSectionId} = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state)=>state.viewCourse);

    
    
    useEffect(() => {
      const setActiveFlags = () => {
        if(!courseSectionData.length) return;
        // console.log("In Sidebar, courseSectionData",courseSectionData)
        const currentSectionIndex = courseSectionData.findIndex(
            (sec) => sec._id === sectionId)

        const currentSubSectionIndex =  courseSectionData?.[currentSectionIndex].subSection.findIndex(
            (subSec)=> subSec._id === subSectionId
        )    
  
        // set current section 
        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
          // set current sub section 
        setVideoBarActive(courseSectionData?.[currentSectionIndex].subSection?.[currentSubSectionIndex]?._id )
      }
      
      setActiveFlags();

      
  }, [
  courseSectionData,
  sectionId,
  subSectionId,
  setActiveStatus,
  setVideoBarActive,
  location.pathname,
]);
    
    useEffect(() => {
      
    
        return () => {
            dispatch(setCourseSectionData([]));
            
            dispatch(setEntireCourseData([]));
            
            dispatch(setCompletedLectures(0))
          }
  }, [dispatch]);
    
    const handleAddReview = () => {
        // console.log("I am inside Add handleAddReview")
        setReviewModal(true);
    }
  return (
    <>

    {/* Toggle button visible only on small screens */}
<button
  className="fixed z-40 top-15 left-4 p-2 bg-richblack-800 text-white rounded-md md:hidden"
  onClick={() => setIsMobileSidebarOpen(true)}
>
  ☰
</button>


{isMobileSidebarOpen && (
  <div className="fixed z-50 h-full w-[80%] max-w-[300px] bg-richblack-800 md:hidden p-4 overflow-y-auto">
    
    {/* Top buttons: Back and Add Review */}
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => {
          navigate("/dashboard/enrolled-courses")
          setIsMobileSidebarOpen(false)
        }}
        className="text-white bg-richblack-600 px-3 py-1 rounded hover:bg-richblack-700"
      >
        ← Back
      </button>
      <IconBtn
        text="Add Review"
        customClasses="ml-auto"
        onclick={() => {
          setReviewModal(true)
          setIsMobileSidebarOpen(false)
        }}
      />
    </div>

    {/* Course Name and Progress */}
    <div className="mb-4">
      <p className="text-lg font-bold text-richblack-5">{courseEntireData?.courseName}</p>
      <p className="text-sm text-richblack-300">
        {completedLectures?.length} / {totalNoOfLectures}
      </p>
    </div>

    {/* Sections and Subsections */}
    {courseSectionData.map((course, index) => (
      <div key={index} className="mb-2">
        <div
          className="bg-richblack-600 px-4 py-2 cursor-pointer"
          onClick={() => setActiveStatus(course?._id)}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-richblack-100">{course?.sectionName}</span>
            <BsChevronDown
              className={`transition-transform duration-300 ${
                activeStatus === course?._id ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {activeStatus === course?._id && (
          <div className="bg-richblack-700">
            {course.subSection.map((topic, i) => (
              <div
                key={i}
                onClick={() => {
                  navigate(
                    `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                  )
                  setVideoBarActive(topic?._id)
                  setIsMobileSidebarOpen(false)
                }}
                className={`flex items-center gap-2 px-4 py-1 text-sm ${
                  videoBarActive === topic._id
                    ? "bg-yellow-200 font-semibold text-richblack-800"
                    : "hover:bg-richblack-900 text-richblack-200"
                }`}
              >
                <input type="checkbox" onChange={() => {}} />
                <span>{topic.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
)}


<div className="hidden md:flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            {/* for buttons and headings */}
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                {/* for buttons */}
                <div className="flex w-full items-center justify-between ">
                    <div 
                    onClick={()=> {
                        navigate("/dashboard/enrolled-courses")
                    }}
                    className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                    title="back"
                    >
                        <IoIosArrowBack size={30} />
                    </div>

                    <div>
                        <IconBtn 
                            text="Add Review"
                            customClasses="ml-auto"
                            onclick={() => handleAddReview()}
                        />
                    </div>

                </div>
                {/* for heading or title */}
                <div className="flex flex-col">
                    <p>{courseEntireData?.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500">{completedLectures?.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* for sections and subSections */}
            <div  className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((course, index)=> (
                        <div
                        className="mt-2 cursor-pointer text-sm text-richblack-5"
                        onClick={() => setActiveStatus(course?._id)}
                        key={index}
                        >

                            {/* section */}

                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {course?.sectionName}
                                </div>
                                {/* HW- add icon here and handle rotate 180 logic */}
                                <div className="flex items-center gap-3">
                                    {/* <span className="text-[12px] font-medium">
                                        Lession {course?.subSection.length}
                                    </span> */}
                                    <span
                                        className={`${
                                        activeStatus === course?.sectionName
                                            ? "rotate-0"
                                            : "rotate-180"
                                        } transition-all duration-500`}
                                    >
                                        <BsChevronDown />
                                    </span>
                                </div>
                            </div>

                            {/* subSections */}
                            <div>
                                {
                                    activeStatus === course?._id && (
                                        <div>
                                            {
                                                course.subSection.map((topic, index) => (
                                                    <div
                                                    className={`flex gap-3  px-5 py-2 ${
                                                        videoBarActive === topic._id
                                                        ? "bg-yellow-200 font-semibold text-richblack-800"
                                                        : "hover:bg-richblack-900"
                                                    }`}
                                                    key={index}
                                                    onClick={() => {
                                                        navigate(
                                                            `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                                                        )
                                                        setVideoBarActive(topic?._id);
                                                    }}
                                                    >
                                                        <input
                                                        type='checkbox'
                                                        // checked= {completedLectures.includes(topic?._id)}
                                                        onChange={() => {}}
                                                        />
                                                       <span className="text-xs md:text-sm">
                                                        {topic.title}
                                                        </span>

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar