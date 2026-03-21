const express = require("express")
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const {userAuth} = require("./middleware/auth")


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

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
          const token = await user.getJWT();
      
          res.cookie("token", token,{
            expires: new Date(Date.now() + 8 * 3600000),
          });

          res.json({ message: "Login successful" });

      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
    });

     app.get("/profile", userAuth, async (req,res) =>{
      try{
      const user = req.user;
      res.send(user)
      }
      catch(err){
        res.status(400).send("ERROR: "+err.message);
      }
    })

    app.get("/sendConnectionRequest", userAuth, async (req,res) =>{
        try{
          const user = req.user;
          res.send(user.firstName +" sent the connection request!")
        }
        catch(err){
          res.status(400).send(err.message);
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
