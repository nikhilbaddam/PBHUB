const mongoose=require('mongoose');
 const bedShema= new  mongoose.Schema({
    
    floor:{type:Number},
    section:{type:String},
    room:{type:Number},
    bed:{type:Number},
    isOccupied:{type:Boolean,default:false},
    guestId:{type:String},
    amount:{type:Number}

 })

 module.exports = mongoose.model('Beds', bedShema);