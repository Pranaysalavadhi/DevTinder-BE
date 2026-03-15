const express = require("express")

const app = express();

const {adminAuth} = require('./middleware/auth')

app.use("/",adminAuth)

app.get("/admin/getAllData",(req,res)=>{
    res.send("get all data of admin data");
})

app.get("/admin/deleteData",(req,res) =>{
    res.send("deleted all user data")
})

app.listen(3000,() =>{
    console.log(" My app is successfully running on port no 3000") 
})