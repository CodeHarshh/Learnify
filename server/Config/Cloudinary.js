const cloudinary = require("cloudinary");
require('dotenv').config();

const cloudinaryConnect =(req,res) =>{
    try{
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})
    }
    catch(err){
        console.log("error cocurred while connecting cloudinary",err);
    }
}

module.exports = cloudinaryConnect;