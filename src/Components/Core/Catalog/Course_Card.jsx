
import RatingStars from '../../Common/RatingStars'
// import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const CourseCard = ({course, Height}) => {




    // useEffect(()=> {
    //     const count = GetAvgRating(course.ratingAndReviews);
    //     setAvgReviewCount(count);
    // },[course])


    const calculateAvgRating = (Math.random() * 0.6 + 4).toFixed(1);
  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div>
              <div className="rounded-lg">
<img 
  src={course?.thumbnail}
  alt="course thumbnail"
className="w-full max-w-sm mx-auto aspect-video sm:h-[180px] md:h-[200px] lg:h-[220px] object-cover rounded-xl shadow-md"
/>
</div>

                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName} </p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">{calculateAvgRating}</span>
                        <RatingStars Review_Count={calculateAvgRating} />
                         {/* <span>{course?.ratingAndReviews?.length || Math.floor(Math.random() * 41 + 10)}</span> Ratings */}
                    </div>
                    <p className="text-xl text-richblack-5">Rs {course?.price}</p>
                </div>
            </div>
        </Link>

      
    </div>
  )
}

export default CourseCard