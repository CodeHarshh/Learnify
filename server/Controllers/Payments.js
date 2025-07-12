const { instance } = require("../Config/Razorpay");
const Course = require("../Models/Courses");
const User = require("../Models/User");
const mailSender = require("../Utils/MailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { courseEnrollementEmail} = require("../Mail/Templates/CourseEnrollmentEmail");
const axios =require("axios")

const CourseProgress = require("../Models/CourseProgress")

exports.capturePayment = async (req, res) => {

    const {courses} = req.body; // single or mutiple course
    const userId =  req.user.id;

//     console.log("Course:", courses);
// console.log("User ID:", userId);


    if (courses.length === 0) {
        return res.json({
            success:false,
            message:"Provide courseId"
        })
    }

    let totalAmount = 0;

    for (const courseId of courses){
        let course;
        try {
            
            course = await Course.findById(courseId);

            //   console.log("Course:", course);

            if(!course){
                return res.status(200).json({
                    success:false,
                    message:"Course doesn't exist"
                })
            }

            const uid = new mongoose.Types.ObjectId(userId);
            // console.log("UUUIDDD",uid)
        if (course?.studentEnrolled.includes(uid)) {
    return res.status(200).json({
        success: false,
        message: "User already registered",
    });
}


            totalAmount += parseInt(course.price); 
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
    
    console.log("The amount in capturePayment is", totalAmount)
    const currency = "INR"

    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString()
    }

    try {
        const paymentResponse = await instance.orders.create(options)
        res.json({
            success:true,
            message: paymentResponse
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }
}



exports.verifyPayment = async (req,res) => {
    console.log("request in verifyPayment is", req)
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest("hex")

    if (expectedSignature === razorpay_signature) {
        
await axios.post(
    "http://localhost:5000/api/v1/payment/enrollStudents", // Correct endpoint
    { courses, userId }, // Pass the required data in the request body
    {
        headers: {
            Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}`, // Include token if needed
            "Content-Type": "application/json", // Specify JSON content type
        },
    }
);


        return res.status(200).json({success:true, message:"Payment Verified"});
    }
    return res.status(200).json({success:"false", message:"Payment Failed"});
}



exports.enrollStudents = async (req, res) => {
    const { courses, userId } = req.body;
    // console.log("Enrollment of student started");

    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide data for courses or userId",
        });
    }

    try {
        for (const courseId of courses) {
            // Validate if courseId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid course ID: ${courseId}`,
                });
            }

            // Convert to ObjectId
            const objectId = new mongoose.Types.ObjectId(courseId);

            // Adding user to the course
            const updatedCourse = await Course.findByIdAndUpdate(
                objectId,
                {
                    $push: { studentEnrolled: userId },
                },
                { new: true }
            );

            // console.log("--------->USER ENROLLED");

            if (!updatedCourse) {
                return res.status(404).json({
                    success: false,
                    message: `Course with ID ${courseId} not found`,
                });
            }

            // Create course progress for the user
            const courseProgress = await CourseProgress.create({
                courseID: objectId,
                userId: userId,
                completedVideos: [],
            });

            // Add course and progress to the user's record
            const updatedStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: objectId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            if (!updatedStudent) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update student with course progress",
                });
            }
        }

        // Success response after processing all courses
        return res.status(200).json({
            success: true,
            message: "Enrollment completed successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// exports.sendPaymentSuccessEmail = async (req,res) => {
//     const {orderId, paymentId, amount} = req.body;

//     const userId = req.user.id;

//     if(!orderId || !paymentId || !amount || !userId) {
//         return res.status(400).json({success:false, message:"Please provide all the fields"});
//     }

//     try {
//         const user = await User.findById(userId);
//         await mailSender(
//             user.email,
//             `Payment Received`,
//             paymentSuccessEmail(`${user.firstName}`,
//              amount/100,orderId, paymentId)
//         )
//     } catch (error) {
//         console.log("error in sending mail", error)
//         return res.status(500).json({success:false, message:"Could not send email"})
//     }
// }


// capture the payment and initate Razerpay

// exports.capturePayment = async (req, res) => {
//   try {
//     const { course_id } = req.body;
//     const userID = req.user.id;

//     if (!course_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Course ID is required" });
//     }

//     let course = await Course.findById(course_id);

//     if (!course) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Could not find course id" });
//     }

//     // check if the user already paid for the course or not
//     const uId = new mongoose.Types.ObjectId(userID);
//     if (course.studentEnrolled.includes(uId)) {
//       return res.status(200).json({
//         success: true,
//         message: "User already enrolled in this course",
//       });
//     }

//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: `${Date.now()}-${userID}-${Math.random()
//         .toString(36)
//         .substr(2, 9)}`,
//       notes: {
//         courseId: course_id,
//         userID,
//       },
//     };

//     // initiate payment useing razorpay
//     const paymentResponse = await instance.orders.create(options);
//     console.log(paymentResponse);
//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Error in Capture Payment. Internal server error",
//     });
//   }
// };

// exports.verifyPayment = async (req, res) => {
//   try {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));

//     const digest = shasum.digest("hex");

//     if (signature == digest) {
//       console.log("Payment is Authorised");

//       const { courseId, userId } = req.body.payload.payment.entity.notes;

//       try {
//         // full fill action

//         // find the course and enrolled student
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentEnrolled: userId } },
//           { new: true }
//         );

//         if (!enrolledCourse) {
//           return res.status(500).json({
//             success: false,
//             message: "Course not found",
//           });
//         }

//         console.log(enrolledCourse);

//         //  find the student and add the couser to thier list enrollment

//         const enrolledStudent = await User.findOneAndUpdate(
//           { _id: userId },
//           { $push: { courses: courseId } },
//           { new: true }
//         );

//         console.log(enrolledStudent);

//         // send conformation mail
//         const emailResponse = await mailSender(
//           enrolledStudent.email,
//           "Congraturlation form Harsh",
//           "Successfull Purchased the new course - by harsh"
//         );
//       } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//           success: false,
//           message: "Internal server error",
//         });
//       }

//       console.error(emailResponse);
//       return res.status(200).json({
//         success: true,
//         message: "Signature verified and course added",
//       });
//     }
//     if (signature !== digest) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
