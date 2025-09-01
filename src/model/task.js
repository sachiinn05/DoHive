const mongoose=require("mongoose");
const  taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxLength:600,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        required:true,

    },
    location:{
        type:String,
        required:true,
        maxLength:100,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["open", "assigned", "completed"],
            message: `{VALUE} is incorrect status type`, 
        },
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,         
    },
    createdAt: {
       type: Date,
       default: Date.now,      
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",             
   },
},{
    timestamps:true
});
module.exports=mongoose.model("Task",taskSchema);