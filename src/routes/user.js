const express = require("express");
const userRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
// Get all the pending connection request for the loggedIn user.
userRouter.get('/user/requests/received',userAuth, async (req,res) =>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId",USER_SAFE_DATA);
        // }).populate("fromUserId",["firstName","lastName"]);

        res.json({
            message:"Data fetched successfully",
            data: connectionRequests,
        })
    }
    catch(err){
      res.status(400).send("Error : " + err.message);
    }
})
userRouter.get('/user/connections', userAuth, async (req, res) =>{
    try{
      const loggedInUser = req.user;

      const connections = await ConnectionRequestModel.find({
        $or: [
            {toUserId: loggedInUser._id, status: "accepted" },
            {fromUserId : loggedInUser._id, status: "accepted" },
        ],
      }).populate("toUserId",USER_SAFE_DATA)
        .populate("fromUserId",USER_SAFE_DATA);

      const data = connections.map((row) => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
         return row.toUserId;
        }
        return row.fromUserId;
        });
      res.json({
        message:"Data fetched successfully",
        data: data
      })
    }
    catch(err){
        res.status(500).send("Error : "+ err.message);
    }
})
userRouter.get('/feed', userAuth, async (req,res) =>{
  try{
    // User should see all the user cards except
    // 0. his own card
    // 1. his connections
    // 2. ignored profiles
    // 3. already sent the connection request.

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page-1)*limit;

    // Find all connection requests (send +  received).
    const connectionRequests = await ConnectionRequestModel.find({
       $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId")

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) =>{
      hideUsersFromFeed.add(req.fromUserId._id.toString());
      hideUsersFromFeed.add(req.toUserId._id.toString());
    })

    const users = await User.find({
      $and: [
        {_id: { $nin: Array.from(hideUsersFromFeed) } },
        {_id: { $ne: loggedInUser._id } }       
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({ data : users });
  }
  catch(err){
     res.status(400).json({message: err.message});
  }
})
module.exports = userRouter;