const express=require('express');
const cors=require('cors');
const connectDB  = require('./config/db.js');



//app config
const app=express();
const port=3000 ;
app.use(cors());


app.use(express.json());


//db connection
connectDB();



//routes api endpoints
app.use('/users',require('./routes/userRoute.js'));
app.use('/guests',require('./routes/guestRoute.js'));
app.use('/bed',require('./routes/bedRoute.js'))



app.get("/",(req,res)=>{
    res.send("API WORKING")
})


app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
})