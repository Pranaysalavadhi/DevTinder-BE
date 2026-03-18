const express = require("express")
const connectDB = require("./config/database");
const Usermodel = require("./models/user");
const app = express();

 app.use(express.json());

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
      // creating a mew instance of the usermodel.
      const user = Usermodel(req.body);
      try{
        await user.save();
        res.send("user added successfully in db")
      }
      catch(err){
         res.status(400).send("Error saving the user : " + err.message)
      }
      
    })
