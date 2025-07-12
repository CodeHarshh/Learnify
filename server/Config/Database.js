const mongoose = require("mongoose");

require("dotenv").config();

const Dbconnect = (req,res) => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err.message);
    });
};

module.exports=Dbconnect;
