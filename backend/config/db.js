const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.MONGODB_CONNECTION)
 const connectDB=async()=>{
    await mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>console.log("DB connected"));


}

module.exports = connectDB;