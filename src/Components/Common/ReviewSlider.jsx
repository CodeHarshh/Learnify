import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "../../App.css"
import { FaStar } from "react-icons/fa"
import { Autoplay, FreeMode, Pagination } from "swiper/modules"
import { apiConnector } from "../../Services/apiconnector"
import { review } from "../../Services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector("GET", review.REVIEWS_DETAILS_API)
      if (data) {
        setReviews(data)
      }
    })()
  }, [])

  return (
    <div className="text-white">
      <div className="my-[50px] h-fit max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView:3 },
          }}
          spaceBetween={25}
          loop={reviews.length > 3}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          speed={1000}
          freeMode={false}
          grabCursor={true}
          modules={[Autoplay, Pagination, FreeMode]}
          className="w-full"
        >
            
        {reviews.map((review, i) => (
  <SwiperSlide key={i}>
    <div className="flex flex-col justify-between h-[200px] bg-richblack-800 p-3 text-[14px] text-richblack-25 rounded-md">
      <div className="flex items-center gap-4">
        <img
          src={
            review?.user?.image
              ? review.user.image
              : `https://api.dicebear.com/5.x/initials/svg?seed=${review.user.firstName} ${review.user.lastName}`
          }
          alt="user"
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-richblack-5">
            {`${review.user.firstName} ${review.user.lastName}`}
          </h1>
          <h2 className="text-[12px] font-medium text-richblack-500">
            {review.course?.courseName}
          </h2>
        </div>
      </div>

      <p className="font-medium text-richblack-25">
        {review.review.split(" ").length > truncateWords
          ? `${review.review.split(" ").slice(0, truncateWords).join(" ")}...`
          : review.review}
      </p>

      <div className="flex items-center gap-2">
        <ReactStars
          count={5}
          value={review.rating || 0}
          size={20}
          edit={false}
          activeColor="#ffd700"
          emptyIcon={<FaStar />}
          fullIcon={<FaStar />}
        />
      </div>
    </div>
  </SwiperSlide>
))}

        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
