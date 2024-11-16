const mongoose = require('mongoose');
 const connectDB=async()=>{
    await mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>console.log("DB connected"));


}

module.exports = connectDB;