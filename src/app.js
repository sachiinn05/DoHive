const express=require("express");
const connectDB=require("./config/database.js");
const cookieParser=require("cookie-parser")
const app=express();
app.use(express.json());
app.use(cookieParser());
const authRouter=require("./router/auth.js")
const profileRouter=require("./router/profile.js")
app.use("/",authRouter);
app.use("/",profileRouter);

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


