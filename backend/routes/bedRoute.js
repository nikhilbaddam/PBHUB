const express = require("express");
const router = express.Router();
const {addBed, getAllBeds, deleteBed}=require('../controllers/bedController.js');
router.post('/addbed',addBed);
router.get('/allbeds',getAllBeds);
router.delete('/deletebed/:bedId',deleteBed);

module.exports = router;