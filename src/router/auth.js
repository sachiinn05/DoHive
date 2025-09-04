const express=require("express");
const authRouter=express();
const bcrypt=require("bcrypt")
const User=require("../model/user")
const jwt = require('jsonwebtoken')

const {validateSignUpData}=require("../utils/validation")
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

authRouter.post('/reset-password',async(req,res)=>{
    const {emailId} = req.body;
    console.log("🚀 ~ emailId:", emailId)
    const user = await User.findOne({emailId: emailId});
    if (!user) {
        throw new Error("Email ID not found");
    }
    const token =await jwt.sign({id : user._id},"mysecretkey",{expiresIn: '15m'})
    res.status(200).json({"token": token})
});


authRouter.post('/reset-password/:token',async(req,res)=>{
    const {token} = req.params;
    const {id} = jwt.verify(token,"mysecretkey" )
    const {password} = req.body;
    const passwordHash= await bcrypt.hash(password,10);
    await User.findByIdAndUpdate(id,{password: passwordHash});
    res.status(200).json({message: "Password Changed Successfully"})
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