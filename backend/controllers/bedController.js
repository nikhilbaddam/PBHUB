const Bed=require('../models/bedModel.js');

 

// Controller to add a new bed with the next available bed number in the specified room
const addBed = async (req, res) => {
    try {
        const { floor, section, room,amount } = req.body;

        // Find the existing beds in the specified room, sorted by bed number in descending order
        const existingBed = await Bed.findOne({ floor, section, room })
            .sort({ bed: -1 }) // Get the highest bed number
            .exec();

        // Determine the next available bed number
        const nextBedNumber = existingBed ? existingBed.bed + 1 : 1;

        // Create the new bed with the next bed number
        const newBed = new Bed({
            floor,
            section,
            room,
            bed: nextBedNumber,
            isOccupied: false,
            amount
        });

        // Save the new bed to the database
        await newBed.save();

        res.status(201).json({ message: 'Bed added successfully', newBed });
    } catch (error) {
        res.status(500).json({ message: 'Error adding bed', error: error.message });
    }
};




const getAllBeds = async (req, res) => {
    try {
        const beds = await Bed.find();
        res.status(200).json(beds);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





module.exports = { addBed ,getAllBeds};
