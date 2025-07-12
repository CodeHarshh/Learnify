const express = require("express")
const router = express.Router()

const{auth,isAdmin,isInstructor,isStudent}=require("../Middlewares/auth");
const { verifyPayment,capturePayment,enrollStudents } = require("../Controllers/Payments");

router.post("/capturePayment",auth,isStudent,capturePayment);
router.post("/verifyPayment",auth,isStudent,verifyPayment);

router.post("/enrollStudents",auth,isStudent,enrollStudents);

// router.post("/capturePayment",auth,isStudent,capturePayment);
// router.post("/verifyPayment",auth,isStudent,verifyPayment);

// router.post("/enrollStudents",auth,isStudent,enrollStudents)

module.exports = router