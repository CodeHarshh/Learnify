import  { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BigPlayButton, Player } from "video-react"

import 'video-react/dist/video-react.css';

import IconBtn from '../../Common/IconBtn';

const VideoDetails = () => {
    const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate(); 

  const location = useLocation();
  const playerRef = useRef();
 
  const {courseSectionData, courseEntireData} = useSelector((state)=>state.viewCourse);
  const [previewSource, setPreviewSource] = useState("")
  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);

   // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    const setVideoSpecificDetails = () => {
        // console.log("In VideoDetails, courseSectionData",courseSectionData)
        if(!courseSectionData.length)
            return;
        if(!courseId && !sectionId && !subSectionId) {
            navigate("/dashboard/enrolled-courses");
        }
        else {
            //let's assume all 3 fields are present
            console.log("9999999->",courseSectionData);
            const filteredData = courseSectionData.filter(
                (course) => course._id === sectionId
            )
          

          const filteredVideoData = filteredData?.[0].subSection.filter(
                (data) => data._id === subSectionId
            )

                    //    console.log("9999999->",filteredVideoData[0]);

            setVideoData(filteredVideoData[0]);
            setPreviewSource(courseEntireData.thumbnail)
            setVideoEnded(false);

        }
    }
    setVideoSpecificDetails();
}, [
  courseSectionData,
  courseEntireData,
  location.pathname,
  courseId,
  sectionId,
  subSectionId,
  navigate,
]);
  
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0) {
        return true;
    }
    else {
        return false;
    }
  } 

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )

    if(currentSectionIndex === courseSectionData.length - 1 &&
        currentSubSectionIndex === noOfSubSections - 1) {
            return true;
        }
    else {
        return false;
    }


  }
const goToNextVideo = () => {
  const currentSectionIndex = courseSectionData.findIndex(
    (data) => data._id === sectionId
  );

  const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
    (data) => data._id === subSectionId
  );

  const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

  if (currentSubSectionIndex < noOfSubSections - 1) {
    // ✅ Same section - go to next video
    const nextSubSectionId =
      courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;

    navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
  } else if (currentSectionIndex < courseSectionData.length - 1) {
    // ✅ Move to next section's first video (if it exists)
    const nextSection = courseSectionData[currentSectionIndex + 1];
    const nextSectionId = nextSection._id;

    if (nextSection.subSection.length > 0) {
      const nextSubSectionId = nextSection.subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    } else {
      console.log("✅ Next section has no videos.");
      // You can show a toast or skip to further sections
    }
  } else {
    console.log("✅ Last video reached!");
    // Optional: toast.success("You've completed the course!")
  }
};


const goToPrevVideo = () => {
  const currentSectionIndex = courseSectionData.findIndex(
    (data) => data._id === sectionId
  );

  const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
    (data) => data._id === subSectionId
  );

  if (currentSubSectionIndex > 0) {
    // ✅ Same section, go to previous video
    const prevSubSectionId =
      courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;

    navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
  } else if (currentSectionIndex > 0) {
    // ✅ Previous section, go to its last video
    const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
    const prevSubSectionList = courseSectionData[currentSectionIndex - 1].subSection;
    const prevSubSectionId = prevSubSectionList[prevSubSectionList.length - 1]._id;

    navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
  } else {
    console.log("✅ First video reached!");
    // Optionally show a toast or disable the "Previous" button
  }
};


  // const handleLectureCompletion = async() => {

  //   ///dummy code, baad me we will replace it witht the actual call
  //   setLoading(true);
  //   //PENDING - > Course Progress PENDING
  //   const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
  //   //state update
  //   if(res) {
  //       dispatch(updateCompletedLectures(subSectionId)); 
  //   }
  //   setLoading(false);

  // }

  console.log("=====>",videoData);
  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData ? (<img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />)
        : (
            <Player
                ref = {playerRef}
                aspectRatio="16:9"
                playsInline
                onEnded={() => setVideoEnded(true)}
                src={videoData?.videoUrl}
                 >

                <BigPlayButton position="center" />     

                {
                    videoEnded && (
                        <div style={{
                            backgroundImage:
                            "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                            }}
                        className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                        >
                            {/* {
                                !completedLectures.includes(subSectionId) && (
                                    <IconBtn 
                                        disabled={loading}
                                        onclick={() => handleLectureCompletion()}
                                        text={!loading ? "Mark As Completed" : "Loading..."}
                                        customClasses="text-xl max-w-max px-4 mx-auto"
                                    />
                                )
                            } */}

                            <IconBtn 
                                disabled={loading}
                                onclick={() => {
                                    if(playerRef?.current) {
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                }}
                                text="Rewatch"
                                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                            />

                            <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                {!isFirstVideo() && (
                                    <button
                                    disabled={loading}
                                    onClick={goToPrevVideo}
                                    className='blackButton'
                                    >
                                        Prev
                                    </button>
                                )}
                                {!isLastVideo() && (
                                    <button
                                    disabled={loading}
                                    onClick={goToNextVideo}
                                    className='blackButton'>
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                }
            </Player>
        )
      }
      <h1 className="mt-4 text-3xl font-semibold">
        {videoData?.title}
      </h1>
      <p className="pt-2 pb-6">
        {videoData?.description}
      </p>
    </div>
  )
}

export default VideoDetails