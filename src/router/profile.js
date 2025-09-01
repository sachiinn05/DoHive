const express=require("express");
const { userAuth } = require("../middleware/auth");
const {validateUpdateProfile}=require("../utils/validation")
const profileRouter=express.Router();

profileRouter.get("/profile",userAuth,async (req,res)=>{
    try{
    const user=req.user;
    res.send(user);
    }catch(err){
        res.status(400).send("Error:"+ err.message);
    }
});

profileRouter.patch("/profile/editi",userAuth,async (req,res) => {
    try{
        if(!validateUpdateProfile(req))
        {
            throw new Error("Invalid user Request");
        }
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
        await loggedInUser.save();
        res.json({
            message:`${loggedInUser.firstName},your profile update`,
            data:loggedInUser,
        })
    }catch(err){
      res.status(400).send("ERROR :"+err.message);   
    }
    
})
module.exports=profileRouter;