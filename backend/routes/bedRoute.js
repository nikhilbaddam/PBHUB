const express = require("express");
const router = express.Router();
const {addBed, getAllBeds}=require('../controllers/bedController.js');
router.post('/addbed',addBed);
router.get('/allbeds',getAllBeds)

module.exports = router;