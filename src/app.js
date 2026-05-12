const express = require("express")
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");

require("dotenv").config();

 // middlewares

//  app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//  }));

app.use(cors({
  origin: "https://devtinder-ui.onrender.com", // Replace with your actual Render UI URL
  credentials: true
}));
 app.use(express.json()); 
 app.use(cookieParser())  

const router = require('./routes/auth');
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')

 app.use('/',router);
 app.use('/',profileRouter);
 app.use('/',requestRouter);
 app.use('/',userRouter);

     connectDB()
    .then(() =>{
        console.log("Database connection established...");
        app.listen(process.env.PORT,() =>{
        console.log(" My app is successfully running on port no 3000") 
       })
    }) 
    .catch((err) => {
        console.error("Database cannot be connected!!");
    })
