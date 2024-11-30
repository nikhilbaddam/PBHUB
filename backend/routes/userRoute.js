const express = require("express");
const router = express.Router();
const {
  loginuser,
  registeruser,
  forgotPassword,
  verifyOTP,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const Auth = require("../middleware/Auth");
const User = require("../models/userModel");
const { getAllBeds } = require("../controllers/bedController");

// create new user with unique email and username
router.post("/register", registeruser);

// get username/email and related password and login
router.post("/login", loginuser);

// forgot password
router.post("/forgotpassword", forgotPassword);

// verify and change password
router.post("/verifyotp", verifyOTP);

router.get("/getuser", Auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch all user details
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json(user); // Send full user object
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});


router.get('/getusers',getAllUsers);
router.delete('/deleteuser/:userId',deleteUser);

module.exports = router;
