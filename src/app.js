const express = require("express")
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")


 app.use(express.json()); // middleware
 app.use(cookieParser())

    app.post("/signup", async (req, res) => {
      try {
      // Validate the data
        validateSignUpData(req);

        const {firstName,lastName,emailId,password} = req.body;
      // Encrypt the password
        
        const hashPassword = await bcrypt.hash(password,10)
     
        if (await User.findOne({ emailId: req.body.emailId }))
          return res.status(400).send("Email already exists");

        await new User({
          firstName,
          lastName,
          emailId,
          password:hashPassword,
        }).save();
        res.send("User added Successfully !!");
      } catch (e) {
        res.status(400).send(e.message);
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const { emailId, password } = req.body;
        // validation
        if (!emailId || !password) {
          return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ emailId });

        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
          // Create a JWT Token

          const token = await jwt.sign({_id: user._id}, "DEV@Tinder");
          console.log(token)

          // add the token to cookie and send the response back to user.
          res.cookie("token", token);

          res.json({ message: "Login successful" });

      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
    });

     app.get("/profile", async (req,res) =>{
      try{
        const cookies = req.cookies;
      
      const {token} = cookies;
      // Validate the token

      const decodedMessage = await jwt.verify(token, "DEV@Tinder");
      const {_id} = decodedMessage;
 
      const user = await User.findById(_id);
      if(!user){
        throw new Error("User does not exist");
      }
      res.send(user)
    }
      catch(err){
        res.status(400).send("ERROR: "+err.message);
      }
    })

    app.get('/user/:userId', async (req,res) =>{
      const userId = req.params?.userId;
      try{
        const user = await User.findOne({_id : userId});
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

    app.delete('/user/:userId', async (req,res) => {
      const userId = req.params?.userId;
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

    app.patch('/user/:userId', async (req,res) =>{
      const userId = req.params?.userId;
      const data = req.body;

      try{

        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills","password"];
        const isUpdateAllowed = Object.keys(data).every(k =>
          ALLOWED_UPDATES.includes(k)
);
        if(!isUpdateAllowed){
          throw new Error("Update not Allowed");
        }
        if(data?.skills.length > 10){
          throw new Error(" Skills Cannot be more than 10 ");
        }

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
