const mongoose=require('mongoose');
 const bedShema= new  mongoose.Schema({
    
    floor:{type:String},
    section:{type:String},
    room:{type:String},
    bed:{type:Number},
    isOccupied:{type:Boolean,default:false},
    guestId:{type:String},
    amount:{type:Number}

 })

 module.exports = mongoose.model('Beds', bedShema);