const validator = require("validator")

const validateSignUpData = (req) => {
      const {firstName, lastName, emailId, password} = req.body;

      if(!firstName || !lastName){
        throw new Error("Please enter the name");
      }
      else if(!validator.isEmail(emailId)){
        throw new Error ("Please enter Valid email address");
      }
      else if(!validator.isStrongPassword(password)){
        throw new Error( "Isn't Strongpassword");
      }
}

const validateEditProfileData = (req) => {
   const allowedEditFields = [
    "firstName", "lastName", "photoUrl", 
    "gender", "about", "age", "skills"
   ];

   const isEditAllowed = Object.keys(req.body).every(field => 
    allowedEditFields.includes(field)
   );

   return isEditAllowed;
};

module.exports= {
     validateSignUpData,
     validateEditProfileData,
}