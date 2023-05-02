const express=require("express");
require("dotenv").config();
const {connection}=require("./config/db");
const { userRouter } = require("./routes/userRoute");
const { postRoute } = require("./routes/postRoute");
const app=express();

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Welcome to social media app")
})
app.use("/",userRouter) 
app.use("/",postRoute);
app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB");
        console.log(`Server is running at port ${process.env.port}`)
    } catch (error) {
        console.log("error while connecting to DB");
        console.log(error);
    }
})