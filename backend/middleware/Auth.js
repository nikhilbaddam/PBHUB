// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
    
        const {token}=req.headers;
        if(!token){
            return res.json({success:false,message:"Not authorized login again"})
        }
        try {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) return res.status(403).json({ message: "Invalid token." });
                req.user = user; // Attach decoded user info (like ID) to req object
               
                next();
               
            });
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"error"})
            
        }
    
    }

module.exports = Auth;
