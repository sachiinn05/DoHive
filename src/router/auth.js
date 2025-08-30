const express=require("express");
const authRouter=express();
const bcrypt=require("bcrypt")
const User=require("../model/user")
const validateSignUpData=require("../utils/validation")
authRouter.post("/signup",async(req,res)=>{
    try{
         validateSignUpData(req);
         const {firstName,lastName,emailId,password}=req.body;
         const passwordHash= await bcrypt.hash(password,10);
         console.log(passwordHash);
         const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
         });
         await user.save()
         res.send("SignUp Successful")
    }catch(err){
         res.status(400).send("ERROR : "+ err.message)
    }
});
module.exports=authRouter;