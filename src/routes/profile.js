const express = require('express')
const profileRouter = express.Router();
const {userAuth} = require('../middleware/auth')
const {validateEditProfileData} = require('../utils/validation')
const bcrypt = require('bcrypt')
const validator = require('validator')

 profileRouter.get("/profile/view", userAuth, async (req,res) =>{
      try{
      const user = req.user;
      res.send(user)
      }
      catch(err){
        res.status(400).send("ERROR: "+ err.message);
      }
    })
  
  profileRouter.patch('/profile/edit', userAuth, async (req,res) => {
    try{
      if(!validateEditProfileData(req)){
         throw new Error("Invalid Edit Request");
      }
      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

      await loggedInUser.save();

      res.json({
        message:`${loggedInUser.firstName}, your profile updated successfully`,
        data: loggedInUser,
      });
    }
      catch(err){
        res.status(400).send("ERROR: "+ err.message);
      }
  })
  
  profileRouter.patch('/profile/password/update', userAuth, async(req,res) => {
      try{
        const {oldPassword, newPassword} = req.body;

        if (!oldPassword || !newPassword) {
          throw new Error("Both old and new passwords are required");
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, req.user.password);
        if (!isOldPasswordValid) {
          throw new Error("Old password is incorrect");
        }

        // Validate new password strength
        if (!validator.isStrongPassword(newPassword)) {
          throw new Error("New password is not strong enough");
        }
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // Update the password
        req.user.password = hashedNewPassword;
        await req.user.save();

        res.json({
          message: "Password updated successfully"
        });
      }
      catch(err){
        res.status(400).send("ERROR: " + err.message);
      }
  })
  

module.exports = profileRouter;