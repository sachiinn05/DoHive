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
authRouter.post("/login",async(req,res)=>{
    try{
    const {emailId,password}=req.body;
    const user= await User.findOne({emailId:emailId});
    if(!user)
    {
        throw new Error ("User not found");
    }
    const isPasswordValid=await user.validatePassword(password);
    if(isPasswordValid)
    {
        const  token=await user.getJWT();
        res.cookie("token",token,{
            expires:new Date(Date.now()+8*3600000)
        });
        res.send("Login successful");
    }
    else{
        throw new Error("Password is incorrect");
    }
}catch(err)
{
    res.status(400).send("ERROR :"+err.message);
}

});
authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
  });
  res.send("logout successful");
})
module.exports=authRouter;