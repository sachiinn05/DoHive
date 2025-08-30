const mongoose=require("mongoose");
const validator = require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
     firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
               throw new Error("Invalid Email address"+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
     type:String,
     validate(value){
        if(!["male","female","others"].includes(value))
        {
            throw new Error("Gender data is not valid");
        }
     },
    },
    photoUrl:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/female-profile-picture-placeholder-vector-260nw-450966928.jpg",
        validate(value)
        {
            if(!validator.isURL(value))
            {
               throw new Error("Invalid Photo Url"+value);
            }
        },
    },
    about:{
        type:String,
        default:"This is a default about of user"
    },
    skills:{
       type:[String],
    },
    location:{
        type:String,
        require:true,
    } 

},
{
timestamps:true,
});
userSchema.methods.validatePassword=async function(passwordbyInputUser) {
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(passwordbyInputUser,passwordHash);
    return isPasswordValid;
};
userSchema.methods.getJWT=async  function() {
    const user=this;
    const token= await jwt.sign({_id:user._id},"DoHive#234!@123",{expiresIn:"7d"});
    return token;
}

module.exports=mongoose.model("User",userSchema);