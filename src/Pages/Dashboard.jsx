import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Core/Dashboard/Sidebar";
import MyProfile from "../Components/Core/Dashboard/MyProfile";
// import EnrolledCourses from "../Components/Core/Dashboard/EnrolledCourses";
import SettingsPage from "../Components/Core/Dashboard/Settings/SettingsPage";
import AddCourse from "../Components/Core/Dashboard/AddCourse/index";
import MyCourses from "../Components/Core/Dashboard/MyCourses";
import Instructor from "../Components/Core/Dashboard/Instructor";
import {ACCOUNT_TYPE} from "../utils/constant";

function Dashboard() {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.profile);

   console.log("User in Dashboard:", user);
 
  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />


      {/* Instructor-only routes */}


      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          {/* Routes for Dashboard */}
          <Routes>
              {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
    <>
      <Route path="add-course" element={<AddCourse />} />
      <Route path="my-courses" element={<MyCourses />} />
      <Route path="instructor" element={<Instructor />} />
    </>
  )}
            <Route path="my-profile" element={<MyProfile />} />
             <Route path="settings" element={<SettingsPage/>} />
             <Route path="add-course" element={<AddCourse/>} />
                <Route path="my-courses" element={<MyCourses/>} />
          
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
