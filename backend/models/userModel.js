const mongoose=require('mongoose')
const userSchema= mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String},
    phone:{type:Number},
    role:{typr:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true },
    date:{type:Date,default:Date.now()},
    otp: { type: String },
    otpExpiry: { type: Date }
});
module.exports=mongoose.model('users',userSchema);
