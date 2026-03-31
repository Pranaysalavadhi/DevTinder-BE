const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male","female","others"],
            message: `{VALUE} is not a valid gender type`
        }
    },
    photoUrl: {
        type: String,
        default: "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg"
    },
    about: {
        type: String,
        default: "Associate software engineer at Kore.ai"
    },
    skills: {
      type: [String]
    }
},
{
  timestamps : true,
})
// schema methods
userSchema.index({firstName:1, lastName: 1});

userSchema.methods.getJWT = async function(){ 
    const user = this;

    const token = await jwt.sign({_id : user._id},"DEV@Tinder",{expiresIn : "1d"})
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)

    return isPasswordValid;
}

const Usermodel = mongoose.model("user",userSchema);

module.exports = Usermodel;