const express=require("express");
const router=express.Router();

const{updateDisplayPicture,deleteAccount,updateProfile,getAllUserDetails,instructorDashboard
,getEnrolledCourses} =require("../Controllers/Profile")




const{auth,isAdmin,isInstructor,isStudent}=require("../Middlewares/auth");

router.delete("/deleteAccount",auth,deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetail",auth,getAllUserDetails);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);
router.post("/instructorDashboard",auth,instructorDashboard);

router.post("/getEnrolledCourses",auth,getEnrolledCourses)



module.exports = router;