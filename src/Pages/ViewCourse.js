import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../Services/Opertaion/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../Components/Core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../Components/Core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false)
    const {courseId} = useParams();
    const {token} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();
   
   

    // useEffect(() => {
    //     dispatch(setCourseSectionData([]));
        
    //     dispatch(setEntireCourseData([]));
        
    //     dispatch(setCompletedLectures(0))
        
    // }, [])
    

    useEffect(() => {
    const setCourseSpecificDetails = async () => {
        // console.log("In video details page", courseId)
        const courseData = await getFullDetailsOfCourse(courseId, token);
        console.log("++++++>",courseData);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        
        dispatch(setEntireCourseData(courseData.courseDetails));
        
        dispatch(setCompletedLectures(courseData.completedVideos)|| {});
        
        let lectures = 0;
        courseData.courseDetails.courseContent.forEach((sec) => {
            lectures += sec.subSection.length
        } )
        dispatch(setTotalNoOfLectures(lectures))
    }
    
    setCourseSpecificDetails()
    }, [courseId, dispatch, token]);
    
return (
  <>
    <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <VideoDetailsSidebar setReviewModal={setReviewModal} />

      {/* Main content */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="px-4 md:px-6 py-2 text-sm md:text-base">
          <Outlet />
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  </>
)

}

export default ViewCourse