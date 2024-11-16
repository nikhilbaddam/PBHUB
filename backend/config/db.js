const mongoose = require('mongoose');
 const connectDB=async()=>{
    await mongoose.connect('mongodb://localhost:27017/Hotels').then(()=>console.log("DB connected"));


}

module.exports = connectDB;