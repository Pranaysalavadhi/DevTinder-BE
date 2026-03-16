const mongoose = require("mongoose");

 const connectDB = async () => {
    await mongoose.connect("mongodb+srv://DevTinder:2YjAkEeg_697a9F@devtinder.trktiap.mongodb.net/DevTinder")
 }
 module.exports = connectDB;