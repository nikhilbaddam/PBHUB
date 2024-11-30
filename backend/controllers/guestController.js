const Guest = require('../models/guestModel'); // Assuming the Guest model is in a models folder


const { S3Client }=require('@aws-sdk/client-s3');
const multerS3=require('multer-s3');
const multer=require('multer');
const Bed = require('../models/bedModel.js');



// Configure AWS SDK

const client= new S3Client({
    region: "ap-south-1", // Update this to your region
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

// Image storage with S3 using multer-s3
const upload = multer({
    storage: multerS3({
        s3: client, // Use the new S3 client
        bucket: process.env.AWS_BUCKET_NAME,
      
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    }),
});





// Controller to add a new guest



const addGuest = async (req, res) => {
    const {
        name,
        email,
        phoneNumber,
        roomNumber,
        roomType,
        amount,
        regDate,
        referedBy,
        lastPaymentDate,
        initialPayment,
        bedId // Bed ID from request body
    } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    // Accessing the uploaded files from req.files
    const profileImageUrl = req.files['profileImage'] && req.files['profileImage'][0] ? req.files['profileImage'][0].location : '';
    const adhaarImageUrl = req.files['adhaarImage'] && req.files['adhaarImage'][0] ? req.files['adhaarImage'][0].location : '';

    try {
        // Check if a guest already exists in the specified room
        

        // Check if the specified bed exists and is not occupied
        const bed = await Bed.findById(bedId);
        if (!bed) {
            return res.status(404).json({ message: "Bed not found" });
        }
        if (bed.isOccupied) {
            return res.status(400).json({ message: "Bed is already occupied" });
        }
        const roomNumberz=bed.floor+"-"+bed.section+"-"+bed.room
       const nextpayment=new Date(regDate);
       nextpayment.setMonth(nextpayment.getMonth()+1);

        // Create a new guest with the bedId
        const newGuest = new Guest({
            name,
            email,
            phoneNumber,
            roomNumber:roomNumberz,
            roomType,
            amount,
            regDate,
            lastPaymentDate,
            nextPaymentDate:nextpayment,
            initialPayment,
            referedBy,
            bedId: bedId, // Store bedId in newGuest
            profileImage: profileImageUrl,
            adhaarImage: adhaarImageUrl
        });

        // Save the new guest
        await newGuest.save();

        // Update the bed's isOccupied status to true
        bed.guestId=newGuest._id;
        bed.isOccupied = true;
        await bed.save();

        res.status(201).json({ message: "Guest added successfully", guest: newGuest });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};






const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const bedModel = require('../models/bedModel.js');

// Controller to update an existing guest
const updateGuest = async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, roomNumber, roomType, amount, regDate, lastPaymentDate, initialPayment, referedBy } = req.body;
    
    try {
        const guest = await Guest.findById(id);
        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        // Handle new images if provided in the request
        const newProfileImageUrl = req.files['profileImage'] && req.files['profileImage'][0] ? req.files['profileImage'][0].location : guest.profileImage;
        const newAdhaarImageUrl = req.files['adhaarImage'] && req.files['adhaarImage'][0] ? req.files['adhaarImage'][0].location : guest.adhaarImage;

        // Delete old images if new ones are uploaded
        if (newProfileImageUrl !== guest.profileImage && guest.profileImage) {
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: guest.profileImage.split('.com/')[1],
            }));
        }
        if (newAdhaarImageUrl !== guest.adhaarImage && guest.adhaarImage) {
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: guest.adhaarImage.split('.com/')[1],
            }));
        }

        // Update guest fields
        guest.name = name || guest.name;
        guest.email = email || guest.email;
        guest.phoneNumber = phoneNumber || guest.phoneNumber;
        guest.roomNumber = roomNumber || guest.roomNumber;
        guest.roomType = roomType || guest.roomType;
        guest.amount = amount || guest.amount;
        guest.regDate = regDate || guest.regDate;
        guest.lastPaymentDate = lastPaymentDate || guest.lastPaymentDate;
        guest.initialPayment = initialPayment || guest.initialPayment;
        guest.referedBy = referedBy || guest.referedBy;
        guest.profileImage = newProfileImageUrl;
        guest.adhaarImage = newAdhaarImageUrl;

        await guest.save();
        res.status(200).json({ message: "Guest updated successfully", guest });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




// Controller to delete an existing guest
const deleteGuest = async (req, res) => {
    
    const { id } = req.params;
    
    
    try {
        const guest = await Guest.findById(id);
        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        // Delete images from S3 if they exist
        if (guest.profileImage) {
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: guest.profileImage.split('.com/')[1],
            }));
        }
        if (guest.adhaarImage) {
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: guest.adhaarImage.split('.com/')[1],
            }));


        }
        
       if(guest.bedId)
       {
          const bed=await  Bed.findById(guest.bedId);
          if(bed)
          {
            bed.guestId="";
            bed.isOccupied = false;
            await bed.save();
          }
       }
       
        // Remove guest from the database
        await Guest.findByIdAndDelete(id);
        res.status(200).json({ message: "Guest deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// Controller to get all guests
const getAllGuests = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//get single guest
const getGuest=async(req,res)=>
{
    const {guestId}=req.params;
    


    try{

        const guest = await Guest.findById(guestId);
        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }
        res.status(200).json(guest);


    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });


    }
}





// Controller to update payment information for a guest
const updatePayment = async (req, res) => {
    const { guestId } = req.params; // Guest ID from request parameters
    const {  amount, paymentDate, note } = req.body; // Payment details from the request body

    try {
        // Find the guest by ID
        const guest = await Guest.findById(guestId);

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }
        const nextpayment=new Date(guest.nextPaymentDate || guest.regDate);
        nextpayment.setMonth(nextpayment.getMonth()+1);
        guest.nextPaymentDate=nextpayment;
        
        
        // Create a new payment record
        const newPayment = {
            amount,
            paymentDate: paymentDate || new Date(), // Use provided date or default to current date
            note: note || '', // Optional note
        };

        // Update the last payment date to the current payment date
        guest.lastPaymentDate = paymentDate || new Date();

        // Add the new payment to the payment history
        guest.paymentHistory.push(newPayment);

        // Save the updated guest information
        await guest.save();

        res.status(200).json({
            message: "Payment updated successfully",
            guest,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};



const getPaymentStatus = async (req, res) => {
    const { guestId } = req.params; // Guest ID from request parameters

    try {
        // Find the guest by ID
        const guest = await Guest.findById(guestId);

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }


        
        

        const currentDate = new Date(); // Current date
       
        const nextPayment=new Date(guest.nextPaymentDate || guest.regDate);
        
        // Calculate days left until the next payment due date
        const timeDifference = nextPayment.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert from milliseconds to days

        let overdueDays=0;
        let leftoverDays=0;
        if(daysDifference>0)
        {
            leftoverDays=daysDifference;
        }
        else{
            overdueDays=daysDifference;

        }

        res.status(200).json({
            message: "Payment status retrieved successfully",
            leftoverDays,overdueDays
            
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            leftoverDays,
            overdueDays
        });
    }
};


const getHistory=async(req,res)=>{
    const {guestId}=req.params;
    try {
        const guest=await Guest.findById(guestId);
        if(!guest)
        {
            return res.status(404).json({message : "guest not found "})
        }
        const history=guest.paymentHistory
        res.status(200).json(history);

        
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
}



// Controller to calculate overdue days and leftover days



module.exports = {
    addGuest,
    getAllGuests,
    updatePayment,
    getPaymentStatus,
    upload,
    updateGuest,
    deleteGuest,
    getHistory,
    getGuest
};
