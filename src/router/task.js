const express=require("express");
const taskRouter=express.Router();
const Task=require("../model/task");
const {userAuth}=require("../middleware/auth");
const { create } = require("../model/user");
const User = require("../model/user");

taskRouter.post("/task/send/:status",userAuth,async (req,res) => {
    try{
        const fromUserId=req.user._id;
        const status=req.params.status;
         const { title, description, category, location } = req.body;
         if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
         }
        const allowedStatus=["open"];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({message:"Invalid Status"+status});
        }
        const user=await User.findById(fromUserId);
        
        
        if(!user)
        {
            return res.status(400).json({message:"Invalid User"})
        }
        const taskAdd=new Task({
            title,
            description,
            category,
            status,
            postedBy:fromUserId,
            location,
        });
        const data=await taskAdd.save()
        res.status(200).json({message:"Task Update",data});
    }catch(err)
    {
        res.status(400).send("Error"+err.message);
    }
    
});
taskRouter.post("/task/:status/:taskId", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { status, taskId } = req.params;

    const allowedStatus = ["open"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    const task = await Task.findById({
        _id:taskId,
        status:"open",
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
     if (task.status === "assigned") {
      return res.status(400).json({ message: "Task is already assigned to someone else" });
    }

    if (task.postedBy.toString() === loggedInUserId.toString()) {
      return res.status(400).json({ message: "You cannot accept your own task" });
    }

    task.status = "assigned";
    task.assignedTo = loggedInUserId;

    const data = await task.save();

    return res.status(200).json({ message: "Task assigned " + status, data });
  } catch (err) {
    return res.status(400).send("Error " + err.message);
  }
});

module.exports = taskRouter;


