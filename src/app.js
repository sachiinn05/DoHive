const express=require("express");
const connectDB=require("./config/database.js");
const app=express();
app.use(express.json());
const authRouter=require("./router/auth.js")
app.use("/",authRouter)

connectDB()
.then(()=>{
    console.log("Database Connection established");
    app.listen(8000,()=>{
    console.log("Server listen on port on 8000");
    });
})
.catch((err)=>{
    console.log("Database not connected");
    
});


