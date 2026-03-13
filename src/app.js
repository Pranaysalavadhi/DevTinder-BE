const express = require("express")

const app = express();

app.use((req,res) =>{
    res.send("Hello from backend with nodemon")
})

app.listen(3000,() =>{
    console.log(" My app is successfully running on port no 3000")
})