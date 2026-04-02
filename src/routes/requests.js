const express = require('express')
const requestRouter = express.Router();
const {userAuth} = require('../middleware/auth')
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

  requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req,res) =>{
        try{
          const fromUserId = req.user._id;
          const { toUserId,status } = req.params;

          // validate status
          const allowedStatus = ["ignored","interested"];
          if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"});
          }
          // 3. Check user exists
          const toUser = await User.findById(toUserId);
          if (!toUser) {
            return res.status(404).json({ message: "User not found" });
          }
          // 4. Prevent duplicate request
          const existingRequest = await ConnectionRequest.findOne({
            $or: [
              { fromUserId, toUserId }, //  duplicate
              { fromUserId: toUserId, toUserId: fromUserId } // reverse duplicate
            ]
          });

          if (existingRequest) {
            return res.status(400).json({ message: "Request already exists" });
          }

          // 5. Save request
          const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
          });

          const data = await connectionRequest.save();

          res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
          });
        }
        catch(err){
          res.status(400).send(err.message);
        }
    })

  requestRouter.post('/request/review/:status/:requestId',userAuth, async (req,res) =>{
        try{
          const loggedInUser = req.user;
          const { requestId, status } = req.params;

          //validate the status
          const allowedStatus = ["accepted","rejected"];
          if(!allowedStatus.includes(status)){
          return res.status(400).json({message : "Invalid status Type" });
          }
          
          const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
          })
          
          if(!connectionRequest){
            return res.status(404).json({message: "Connection Request not found"})
          }
         
          connectionRequest.status = status;

          const data = await connectionRequest.save();
          res.json({message: "Connection Request " + status, data});

        }
        catch(err){
          res.status(400).send(err.message);
        }
})
module.exports = requestRouter;