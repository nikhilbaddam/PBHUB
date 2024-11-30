const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { error } = require("console");
require('dotenv').config();


const email= process.env.EMAIL;

const pass=process.env.PASSWORD;

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email, // Your email
        pass: pass  // Your email password
    }
});


// Generate OTP function
const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex'); // Generates a 6-character hexadecimal OTP
};

// Login User
// Login User
const loginuser = async (req, res) => {
    const { identifier, password,role } = req.body;
    try {
        // Check if the identifier is email or phone number
        let user;
        if (validator.isEmail(identifier)) {
            user = await User.findOne({ email: identifier });
        } else if (validator.isMobilePhone(identifier)) {
            user = await User.findOne({ phone: identifier });
        }

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }
        if(user.role!=role)
        {
            return res.status(400).json({success:false,message:`You dont come under "${role}" check role again`})
        }

        
        // Compare password
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ success: false, message: "Icorrect Password Try again .." });
        }

        // Generate token
        const token = createtoken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


const createtoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register User

const registeruser = async (req, res) => {
    const { name, password, email, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if user with the email or phone already exists
        let emailExists = await User.findOne({
             email: email 
        });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }
        let phoneExists = await User.findOne({
            phone: phone 
       });
       if (phoneExists) {
           return res.status(400).json({ success: false, message: "User already exists with this phone number" });
       }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email is not valid" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name: name,
            email: email,
            phone: phone,
            role: role,
            password: hashedPassword,
        });

        const user = await newUser.save();

        // Generate token
        const token = createtoken(user._id);
        res.json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



const getAllUsers=async  (req,res)=>
{
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}

const deleteUser=async(req,res)=>
{

    const {userId}=req.params;
    try{
        const user= User.findById(userId)
        if(!user)
        {
            return res.status(404).json({message:"user not found",success:false})
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "user  deleted successfully" });
        
    }
    catch(error)
    {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}






const forgotPassword = async (req, res) => {
    const { identifier } = req.body;  // identifier could be email or phone number
    try {
        let user;
        let email;

        // Check if identifier is email or phone number
        if (validator.isEmail(identifier)) {
            user = await User.findOne({ email: identifier });
            email = identifier;  // If it's an email, we use it directly
        } else if (validator.isMobilePhone(identifier)) {
            user = await User.findOne({ phone: identifier });

            if (user) {
                email = user.email; // If it's a phone number, get the corresponding email
            }
        }

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist create one " });
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Update user with OTP and expiration
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email (whether the identifier was email or phone, we use the user's email)
        const mailOptions = {
            from: 'nikhilreddyb457@gmail.com',
            to: email,  // Send OTP to the user's email
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending mail:', error);
                return res.status(500).json({ success: false, message: 'Error sending OTP' });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'OTP sent successfully',
                    sentTo: email // Include the email in the response
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error" });
    }
};



const verifyOTP = async (req, res) => {
    const { identifier, otp, newPassword } = req.body;
    try {
        let user;
        // Check if identifier is email or phone number
        if (validator.isEmail(identifier)) {
            user = await User.findOne({ email: identifier });
        } else if (validator.isMobilePhone(identifier)) {
            user = await User.findOne({ phone: identifier });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // Hash the new password and save
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.otp = undefined; // Clear OTP after successful reset
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error" });
    }
};


module.exports = { loginuser, registeruser, forgotPassword, verifyOTP,getAllUsers,deleteUser };

