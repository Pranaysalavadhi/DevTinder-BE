const express = require("express")
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

 app.use(express.json());

    app.post("/signup", async (req, res) => {
      try {
        if (await User.findOne({ emailId: req.body.emailId }))
          return res.status(400).send("Email already exists");

        await new User(req.body).save();
        res.send("User added Successfully !!");
      } catch (e) {
        res.status(400).send(e.message);
      }
    });
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
        const user = await User.findByIdAndUpdate(userId,data,{
          runValidators: true,
        });
        res.send("User updated successfully");
      }
      catch(err){
        res.status(400).send("UPDATE FAILED : "+ err.message);
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
