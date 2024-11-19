const mongoose = require('mongoose');

// Define the payment history schema
const PaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    note: { type: String }, // Optional field for payment notes
});

// Define the guest schema
const GuestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    roomNumber: { type: String, },
    roomType: { type: Number, required: true },
    bedId:{type:String},
    amount: { type: Number, required: true },
    regDate: { type: Date, required: true },
    lastPaymentDate: { type: Date, required: true },
    nextPaymentDate:{type:Date},
    paymentHistory: [PaymentSchema], // Correctly define paymentHistory as an array of PaymentSchema
    initialPayment: { type: Date, required: true },
    referedBy:{type:String},
    profileImage:{type:String},
    adhaarImage:{type:String}
});

module.exports = mongoose.model('Guests', GuestSchema);
