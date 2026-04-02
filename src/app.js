const express = require("express")
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")

 app.use(express.json()); // middleware
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
        app.listen(3000,() =>{
        console.log(" My app is successfully running on port no 3000") 
       })
    }) 
    .catch((err) => {
        console.error("Database cannot be connected!!");
    })
