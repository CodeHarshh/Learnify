import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export const SidebarLink=({ link, iconName })=> {
  const Icon = Icons[iconName]
  const location = useLocation()   // Gives the current URL (path) of your app.
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)  // matches the current url and the given path
  }

  return (
  <NavLink
  to={link.path}
  onClick={() => dispatch(resetCourseState())}
  className={`relative px-8 py-2 text-sm font-medium rounded-lg shadow-[rgba(0,0,0,0.2)_0_4px_12px] transition-all duration-200 ${
    matchRoute(link.path)
      ? "bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white"
      : "bg-opacity-0 text-richblack-300"
  }`}
>
  <span
    className={`absolute left-0 top-0 h-full w-[0.15rem] bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] ${
      matchRoute(link.path) ? "opacity-100" : "opacity-0"
    }`}
  ></span>
  <div className="flex items-center gap-x-2">
    {/* Icon Goes Here */}
    <Icon className="text-lg" />
    <span>{link.name}</span>
  </div>
</NavLink>

  )
}

