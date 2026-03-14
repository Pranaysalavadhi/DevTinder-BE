const express = require("express")

const app = express();
app.get("/user",(req,res) =>{
    res.send("User form express js")
})

app.get("/",(req,res,next) =>{
    res.send("Hello from backend with nodemon")
})
app.get("/random.text",(req,res,next) =>{
    res.send("random.text")
})

app.get('/user/:userId/:name/:password',(req,res) =>{
   console.log(req.params)
   res.send({firstname: 'Pranay'})
})

app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

app.listen(3000,() =>{
    console.log(" My app is successfully running on port no 3000")
})