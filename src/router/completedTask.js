
const express = require("express");
const completedTask = express.Router();
const Task = require("../model/task");
const { userAuth } = require("../middleware/auth");

completedTask.post("/completedTask/:taskId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { taskId } = req.params;

       
        const task = await Task.findOne({
            _id: taskId,
            status: "assigned",
            assignedTo: loggedInUserId
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found or not assigned to you" });
        }

     
        task.status = "completed";
        await task.save();

        return res.status(200).json({ message: "Task marked as completed", task });
    } catch (err) {
        return res.status(500).json({ message: "Server Error: " + err.message });
    }
});

module.exports = completedTask;

module.exports=completedTask