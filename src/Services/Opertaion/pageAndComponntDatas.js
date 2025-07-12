import { toast } from "react-hot-toast"

import { apiConnector } from "../apiconnector"
import { catalogData } from "../apis"

import { bestPickCourses } from "../apis"

// Tested
export const getCatalogPageData = async ({categoryId}) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    )
    if (!response?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}



export const BestPickCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      bestPickCourses.bestPickCourses_API
    )
    if (!response?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response.data
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

export const MoreRecommendedCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET", // using GET if backend is using GET
      bestPickCourses.moreRecommendedCourses_API // make sure this points to the correct URL
    )
    if (!response?.success) {
      throw new Error("Could not fetch more recommended courses.")
    }
    result = response.data
  } catch (error) {
    console.log("MORE_RECOMMENDED_COURSES_API ERROR............", error)
    toast.error(error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}