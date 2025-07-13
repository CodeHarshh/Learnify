const express = require('express');
const app = express();
const userRoutes=require("./Routes/User")
const paymentRoutes=require("./Routes/Payment");
const profileRoutes=require("./Routes/Profile");
const courseRoutes=require("./Routes/Course");

const dbConnect= require("./Config/Database")
const cookieParser =require("cookie-parser");

const cors=require("cors");
const cloudinaryConnect=require("./Config/Cloudinary");
const razorpayConnect=require("./Config/Razorpay");

require("dotenv").config();
const fileUpload=require("express-fileupload");

const PORT=process.env.PORT || 5000;

dbConnect();

// middleware
app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: "https://learnify-8o13.vercel.app", // React frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow cookies
}));



app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp",
}))

cloudinaryConnect();


app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);


app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is running",
    })
})

app.listen(PORT,()=>{
    console.log("Server is running at Port: ",PORT);
})










