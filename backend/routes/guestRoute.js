const express = require("express");
const router = express.Router();
const {addGuest,getAllGuests, updatePayment, getPaymentStatus,upload, updateGuest, deleteGuest, getHistory}=require('../controllers/guestController.js')
router.post('/addguest',upload.fields(
    [{name:'profileImage',maxCount :1},
        {name:'adhaarImage',maxCount:1}] 
),addGuest);


router.put('/updateguest/:id',upload.fields(
    [{name:'profileImage',maxCount :1},
        {name:'adhaarImage',maxCount:1}]
),updateGuest);
router.delete('/deleteguest/:id',deleteGuest);




router.get('/gethistory/:guestId',getHistory)

router.get('/getguests',getAllGuests);
router.put('/paymentupdate/:guestId',updatePayment);
router.get('/left&overdays/:guestId',getPaymentStatus);
module.exports = router;