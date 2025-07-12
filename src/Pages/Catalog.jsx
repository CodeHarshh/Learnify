import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Particles from "react-tsparticles";

import CourseSlider from "../Components/Core/Catalog/CourseSlider"
import { apiConnector } from "../Services/apiconnector";
import { categories } from "../Services/apis";
import { getCatalogPageData } from "../Services/Opertaion/pageAndComponntDatas";
import Error from "./Error";
import Threads from  "../Components/Common/Threads";

function Catalog() {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
    // const [bestCourses, setbestCourses] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  // Fetch All Categories

  //   useEffect(() => {
  //     ;(async () => {
  //       try {
  //         const res = await apiConnector("GET", categories.CATEGORIES_API)
  //            console.log("======>",res)
  //         //    const categoryMatch = res?.data?.find(
  //         //   (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName

  //         // )
  //         //  console.log("======}}",categoryMatch)
  //         // // , console.log("======}}",catalogName)

  // let categoryMatch = null;
  // for (const ct of res?.data || []) {
  //   const joinedData = ct.name.split(" ").join("-").toLowerCase();
  //   console.log("Joined Data:", joinedData, "| Catalog Name:", catalogName);
  //   if (joinedData == catalogName.toLowerCase()) {
  //     categoryMatch = ct;
  //     break;
  //   }
  // }

  // if (categoryMatch) {
  //   setCategoryId(categoryMatch._id);
  //   console.log("Matched category ID:", categoryMatch._id);
  // } else {
  //   console.log("No matching category found");
  // }

  //         // setCategoryId(category_id)
  //       } catch (error) {
  //         console.log("Could not fetch Categories.", error)
  //       }
  //     })()
  //   }, [catalogName])

  //   useEffect(() => {
  //      console.log("======>",categoryId)
  //     if (categoryId) {
  //       ;(async () => {
  //         try {
  //           const res = await getCatalogPageData(categoryId)

  //           setCatalogPageData(res)
  //         } catch (error) {
  //           console.log(error)
  //         }
  //       })()
  //     }
  //   }, [categoryId])

  useEffect(() => {
    (async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("Fetched categories:", res?.data);

        let categoryMatch = null;
           const normalizedCatalogName = catalogName.split(" ").join("-").toLowerCase();
        for (const ct of res?.data || []) {
          const joinedData = ct.name.split(" ").join("-").toLowerCase();
          console.log(
            "Joined Data:",joinedData,"| Catalog Name:",catalogName
          );
          if (joinedData === normalizedCatalogName) {
            categoryMatch = ct;
            break;
          }
        }

        if (categoryMatch) {
          setCategoryId((prev) => {
            if (prev !== categoryMatch._id) {
              console.log("Setting categoryId:", categoryMatch._id);
              return categoryMatch._id;
            }
            return prev;
          });
        } else {
          console.log("No matching category found");
        }
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
    })();
  }, [catalogName]);

  useEffect(() => {
    if (categoryId) {
      console.log("Triggering getCatalogPageData with ID:", categoryId);
      (async () => {
        try {
          const res = await getCatalogPageData({categoryId:categoryId});
          setCatalogPageData(res);
          // const bestCourses = await BestPickCourses();
          // setbestCourses(bestCourses);
          // console.log("Catalog page data*************:", bestCourses);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [categoryId]);

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!loading && !catalogPageData.success) {
    return <Error />;
  }

  return (
    <>
    <div className="pl-6">

    
   
{/* Hero Section */}
      {/* <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.selectedCourses?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.selectedCourses?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.selectedCourses?.description}
          </p>
        </div>
      </div> */}

 {/* Hero Section */}
      {/* <div className="box-content bg-gradient-to-br from-teal-200 via-teal-300 to-yellow-200 px-4 py-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
  <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
    <p className="text-sm text-white tracking-wide">
      {`Home / Catalog / `}
      <span className="text-yellow-400 font-semibold">
        {catalogPageData?.selectedCourses?.name}
      </span>
    </p>
    <p className="text-4xl font-extrabold text-white">
      {catalogPageData?.selectedCourses?.name}
    </p>
    <p className="max-w-[870px] text-white text-lg leading-relaxed">
      {catalogPageData?.selectedCourses?.description}
    </p>
  </div>
</div> */}



<div className="relative overflow-hidden">

  {/* 🔵 Your Gradient Background */}
  <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-200 via-teal-300 to-yellow-200" />

  {/* 🧵 Threads Effect Layer (on top of background) */}
  <div className="absolute inset-0 z-10 ">
    <Threads
      color={[1, 1, 1]}           // Strong white threads
      amplitude={1.9}            // More wave motion
      distance={0.2}             // Spread lines vertically
      enableMouseInteraction={true}
      className="w-full h-full"
    />
  </div>

  {/* 📝 Foreground Content */}
  <div className="relative z-20 box-content px-4 py-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
    <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
      <p className="text-sm text-white tracking-wide">
        {`Home / Catalog / `}
        <span className="text-yellow-400 font-semibold">
          {catalogPageData?.selectedCourses?.name}
        </span>
      </p>
      <p className="text-4xl font-extrabold text-white">
        {catalogPageData?.selectedCourses?.name}
      </p>
      <p className="max-w-[870px] text-white text-lg leading-relaxed">
        {catalogPageData?.selectedCourses?.description}
      </p>
    </div>
  </div>

</div>

<Particles
    params={{
	    "particles": {
	        "number": {
	            "value": 50
	        },
	        "size": {
	            "value": 3
	        }
	    },
	    "interactivity": {
	        "events": {
	            "onhover": {
	                "enable": true,
	                "mode": "repulse"
	            }
	        }
	    }
	}} />



      {/* Section 1 */} 
   <div className="mx-auto box-content w-[90%] max-w-[90%] px-4 py-12 lg:w-[90%] lg:max-w-[90%]">
    <div className="text-white section_heading">Courses to get you started</div>
    <div className="my-4 flex border-b border-b-richblack-600 text-sm">
        <p
            className={`px-4 py-2 ${
                active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
        >
            Most Popular
        </p>
        <p
            className={`px-4 py-2 ${
                active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
        >
            New
        </p>
    </div>
    <div>
        <CourseSlider Courses={catalogPageData?.selectedCourses?.course} />
    </div>
</div>

{/* Section 2 */}
<hr className="text-white"></hr>
<div className="mx-auto box-content w-[90%] max-w-[90%] px-4 py-12 lg:w-[90%] lg:max-w-[90%]">
    <div className="inline-block text-white text-3xl font-bold mb-6">
        Explore Different Courses
    </div>

    <div className="py-8">
        <CourseSlider Courses={catalogPageData?.differentCourses?.course} />
    </div>
</div>






      {/* Section 3 */}
      {/* <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <Course_Card course={course} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
      </div> */}

     
      </div>
    </>
  );
}

export default Catalog;
