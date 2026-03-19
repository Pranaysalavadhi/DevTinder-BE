const express = require("express")
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

 app.use(express.json());

    app.post("/signup", async (req,res) =>{
      // creating a mew instance of the usermodel.
      const user = User(req.body);
      try{
        await user.save();
        res.send("user added successfully in db")
      }
      catch(err){
         res.status(400).send("Error saving the user : " + err.message)
      }
      
      })
    app.get('/user', async (req,res) =>{
      const UserEmail = req.body.emailId;
      try{
        const user = await User.findOne({emailId: UserEmail});
        if(!user){
        res.status(400).send("user not found");
        }
          res.send(user);

      }
      catch(err){
         res.status(400).send("Something went wrong");
      }
        
    })

    app.get('/feed',async (req,res) =>{
      try{
        const users = await User.find({});
        res.send(users)
      }
      catch(err){
        res.status(400).send("Something went wrong");
      }
    })

    app.delete('/user', async (req,res) => {
      const userId = req.body._id;
      try{
        const user = await User.findByIdAndDelete(userId);
        if(!user)
          res.status(400).send("User not found");

        res.send("User deleted successfully");
      }
      catch(err){
        res.status(400).send("Something went wrong");
      }
    })

    app.patch('/user', async (req,res) =>{
      const userId = req.body._id;
      const data = req.body;

      try{
        const user = await User.findByIdAndUpdate(userId,data);
        res.send("User updated successfully");
      }
      catch(err){
        res.status(400).send("something went wrong ");
      }

    })

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
