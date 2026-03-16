const express = require("express")
const connectDB = require("./config/database");
const Usermodel = require("./models/user");
const app = express();

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

    app.post("/signup", async (req,res) =>{
     const user = new Usermodel({
        firstName: "Pranay",
        lastName: "Salavadhi",
        emailId: "pranaysalavadhi@gmail.com",
        password: "pranay@18"
     });
      await user.save();
      res.send("user added successfully in db")
    })
