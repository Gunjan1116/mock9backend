const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { Usermodel } = require("../models/userModel");
require("dotenv").config();
const userRouter=express.Router();


userRouter.post("/register", async(req,res)=>{
    const {name,email,password,bio,dob,posts,friends,friendRequests}=req.body;

    try {
        let reqData= await Usermodel.find({email});
        if(reqData.length>0){
          return  res.json({"msg":"You already register"})
        }
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                console.log("error while hashing password",err);
                res.json({"msg":"error while hashing password"});
            }else{
                let sendData=new Usermodel({name,email,password:hash,bio,dob,posts,friends,friendRequests});
                await sendData.save();
                res.status(201).json({"msg":"successfully register"})
            }
        })
    } catch (error) {
        console.log("error while registering user",error);
        res.json({"msg":"error while register a user"})
    }
})

userRouter.get("/users",async(req,res)=>{
    try {
        const allData=await Usermodel.find();
        res.status(200).json({"msg":"All register data","data":allData})
    } catch (error) {
        console.log("error while getting all register data");
        res.json({"msg":"error in getting all register data"})
    }
})
///api/users/:id/friends
//This endpoint should return a list of all friends of a specific user identified by its ID.
userRouter.get("/users/:id/friends",async(req,res)=>{
    let ID=req.params.id;
    try {
        const allData=await Usermodel.find({_id:ID});
        let allFriends=allData[0].friends
        res.status(200).json({"msg":`All friends data of ${ID}`,"data":allFriends})
    } catch (error) {
        console.log("error while getting all friends data",error);
        res.json({"msg":"error in getting all friends data"})
    }
})
///api/users/:id/friends
//This endpoint should allow the user to 
//send a friend request to another user identified by its ID.
userRouter.post("/users/:id/friends",async(req,res)=>{
    let ID=req.params.id; 
    let friendId=req.body.friendId
    try {
        const sendingUser=await Usermodel.find({_id:ID});
        const allData=await Usermodel.find({_id:friendId}); 
        let friendsReq=allData[0].friendRequests
        friendsReq.push(ID);
        //console.log(friendsReq)
        await Usermodel.findByIdAndUpdate({_id:friendId},{friendRequests:friendsReq})
        res.status(201).json({"msg":`Friend request is send`})
    } catch (error) {
        console.log("error while Friend request",error);
        res.json({"msg":"error while Friend request"})
    }
})
///api/users/:id/friends/:friendId
//This endpoint should allow users to accept or reject 
//friend requests sent to them by another user identified by its ID.
userRouter.patch("/users/:id/friends/:friendId",async(req,res)=>{
    let ID=req.params.id; 
    let friendId=req.params.friendId
    let msg=req.body.msg;
    try {
        const sendingUser=await Usermodel.find({_id:ID});
        const allData=await Usermodel.find({_id:friendId}); 
        if(msg=="accept"){
           let newData= sendingUser[0].friendRequests.filter((el)=>{
                return el!=friendId;
           })
           let friend=allData[0].friends
           friend.push(ID);
           await Usermodel.findByIdAndUpdate({_id:ID},{friendRequests:newData})
           await Usermodel.findByIdAndUpdate({_id:friendId},{friends:friend});
           res.json({"msg":"Friend request accepted"})
        }else if(msg=="reject"){
            let newData= sendingUser[0].friendRequests.filter((el)=>{
                return el!=friendId;
           })
           await Usermodel.findByIdAndUpdate({_id:ID},{friendRequests:newData})
           res.json({"msg":"Friend request rejected"})
        }
    } catch (error) {
        console.log("error while accept/reject friend request",error);
        res.json({"msg":"error in accept/reject friend request"})
    }
})
// {
//     "name":"abhay",
//     "email":"a@gmail.com",
//     "password":"1234",
//     "dob":"1996/01/04",
//     "bio":"student"
//    }
module.exports={
    userRouter
}