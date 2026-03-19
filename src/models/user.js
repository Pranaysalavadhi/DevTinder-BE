const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        trim: true
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not Valid!!")
            }
        }
    },
    photourl: {
        type: String,
        default: "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg"
    },
    about: {
        type: String,
        default: "Associate software engineer in Kore.ai"
    },
    skills: {
      type: [String]
    }
},
{
  timestamps : true,
})

const Usermodel = mongoose.model("user",userSchema);

module.exports = Usermodel;