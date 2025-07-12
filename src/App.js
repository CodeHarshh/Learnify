import "./App.css";

import { useDispatch } from "react-redux";

import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgotPassword from "./Pages/ForgotPassword";
import OpenRoute from "./Components/Core/Auth/OpenRoute";
import Navbar from "./Components/Common/Navbar"
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./Components/Core/Auth/PrivateRoute";
import { setToken } from "./slices/authSlice";
import { setUser } from "./slices/profileSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Catalog from "./Pages/Catalog";
import CourseDetails from "./Pages/CourseDetails";
import EnrolledCourses from "./Components/Core/Dashboard/EnrolledCourses";
import Cart from "./Components/Core/Dashboard/Cart/index";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./Components/Core/ViewCourse/VideoDetails"
import { ACCOUNT_TYPE } from "./utils/constant"
import ContactPage from "./Pages/Contact";
function App() {
   
  
  const dispatch = useDispatch();
 
  
  const { user } = useSelector((state) => state.profile)
  

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token)); // Update token in Redux
      console.log("Local Storage token",token);
    }

     const user = JSON.parse(localStorage.getItem("user")) ||null; 
    if (user) {
      dispatch(setUser(user)); // Update token in Redux
       console.log("Local Storage user",user);
    }




  }, [dispatch]);



  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* <h1 className="text-4xl font-bold text-blue-500">Hiii</h1> */}
      <Navbar></Navbar>
      <Routes>
       <Route path="/" element={  <Home />} />
        <Route path="/contact" element={  <ContactPage />} />
         {/* <Route path="/" element={  <PrivateRoute> <Home /> </PrivateRoute>} /> */}
         <Route path="/Login" element={  <OpenRoute> <Login /> </OpenRoute>} />
        <Route path="/Signup" element={  <OpenRoute> <Signup /> </OpenRoute>} />
        <Route path="/forgot-password" element={  <OpenRoute> <ForgotPassword /> </OpenRoute>} />
        <Route path="/About" element={   <About /> } />
        {/* <Route path="/dashboard/settings" element={  <PrivateRoute> <SettingsPage /> </PrivateRoute>} /> */}
        <Route path="/verify-email" element={  <OpenRoute> <VerifyEmail /> </OpenRoute>} />
       <Route path="/dashboard/*" element={ <PrivateRoute><Dashboard /></PrivateRoute>  } />

           <Route path="catalog/:catalogName" element={<Catalog />} />
           
            <Route path="courses/:courseId" element={<CourseDetails/>}/>
       
         <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
   

   <Route element={
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }>

            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route
                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    element={<VideoDetails/>}
                  />
                </>
              )
            }
          </Route>
   

    {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route
                    path="/dashboard/cart"
                    element={<Cart/>}
                  />
                </>
              )
            }


      </Routes>
      
    </div>
  );
}

export default App;
