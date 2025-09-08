const express=require("express");
const taskInfo=express.Router();
const Task=require("../model/task");
const User=require("../model/user");
const { userAuth } = require("../middleware/auth");
const {validateTaskInfo}=require("../utils/validation");

taskInfo.get("/usertask/posted",userAuth,async (req,res) => {
    try{
    const user=req.user._id;
    const task=await Task.find({postedBy:user});
    if(!task)
    {
        return res.status(404).json({ message: "No tasks found for this user" }); 
    }
    res.json({message:task});
    }catch(err)
    {
       res.status(500).json({ message: "Server error", error: err.message });
    }
});



taskInfo.get("/usertask/assigned",userAuth,async (req,res) => {
    try{
        const user=req.user._id;
        const task=await Task.find({assignedTo:user});
        if(!task)
         {
           return res.status(404).json({ message: "No tasks assigned to this user" }); 
         }
    res.json({message:task});
    }catch(err)
    {
       res.status(500).json({ message: "Server error", error: err.message });
    }
    
})



taskInfo.put("/taskediti/:taskId", userAuth, async (req, res) => {
  try {
    const isValid = validateTaskInfo(req);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid fields in request" });
    }
    const loggedInUser = req.user._id;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.postedBy.toString() !== loggedInUser.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this task" });
    }
    Object.keys(req.body).forEach((key) => (task[key] = req.body[key]));
    const updatedTask = await task.save();

    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

module.exports = taskInfo;
