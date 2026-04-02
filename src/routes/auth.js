const express = require("express")
const router = express.Router();

const {validateSignUpData} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")

    router.post("/signup", async (req, res) => {
      try {
      // Validate the data
        validateSignUpData(req);

        const {firstName,lastName,emailId,password} = req.body;
      // Encrypt the password
        
        const hashPassword = await bcrypt.hash(password,10)
     
        if (await User.findOne({ emailId: req.body.emailId }))
          return res.status(400).send("Email already exists Please login");

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

    router.post("/login", async (req, res) => {
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

    router.post('/logout', async (req,res) =>{
      res
         .cookie("token",null,{
          expires: new Date(Date.now()),
          })
         .send('logged out successful!!');
    })

    router.post('/forgot-password', async (req, res) => {
      try {
        const { emailId } = req.body;
        if (!emailId) {
          return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ emailId });
        if (!user) {
          return res.status(404).json({ message: 'No user found with that email' });
        }

        const resetToken = await user.generatePasswordReset();

        // In production send email. For now return reset token/link.
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;

        return res.status(200).json({
          message: 'Password reset token generated. Use this token to reset password',
          resetUrl,
          token: resetToken
        });
      } catch (err) {
        res.status(500).json({ message: 'Unable to process forgot password', error: err.message });
      }
    });

    router.post('/reset-password', async (req, res) => {
      try {
        const { token, password } = req.body;
        if (!token || !password) {
          return res.status(400).json({ message: 'Token and new password are required' });
        }

        await User.resetPassword(token, password);

        return res.status(200).json({ message: 'Password has been reset successfully' });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

    module.exports = router;