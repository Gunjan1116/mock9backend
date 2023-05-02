const express=require("express");
const { Postmodel } = require("../models/postModel");


const postRoute=express.Router();

postRoute.get("/posts",async(req,res)=>{
    try {
        const allPost=await Postmodel.find();
        res.status(200).json({"msg":"All posts","data":allPost})
    } catch (error) {
        console.log("error while getting post",error);
        res.json({"msg":"error while getting post"})
    }
})
postRoute.get("/posts/:id",async(req,res)=>{
    let ID=req.params.id;
    try {
        const allPost=await Postmodel.find({_id:ID});
        res.status(200).json({"msg":"paticular posts","data":allPost})
    } catch (error) {
        console.log("error while getting a paticular post",error);
        res.json({"msg":"error while getting a paticular post"})
    }
})
postRoute.post("/posts",async(req,res)=>{
    let {user,text,image,likes,comments}=req.body;
    try {
        const allPost=new Postmodel({user,text,image,createdAt:new Date(),likes,comments});
        await allPost.save();
        res.status(201).json({"msg":"new post is saved"})
    } catch (error) {
        console.log("error while adding post",error);
        res.json({"msg":"error while adding post"})
    }
})
postRoute.patch("/posts/:id",async(req,res)=>{
    let ID=req.params.id;
    let userId=req.body.user;
    let payload=req.body;
    try {
       let postData=await Postmodel.find({_id:ID,user:userId});
       if(postData.length==0){
        return res.json({"msg":"No data found"})
       }
       await Postmodel.findByIdAndUpdate({_id:ID},payload);
       res.json({"msg":"Post Updated successfully"})
    } catch (error) {
        console.log("error while updating",error);
        res.json({"msg":"error while updating"})
    }
})
postRoute.delete("/posts/:id",async(req,res)=>{
    let ID=req.params.id;
    let userId=req.body.user;
    try {
       let postData=await Postmodel.find({_id:ID,user:userId});
       if(postData.length==0){
        return res.json({"msg":"Not Authorized"})
       }
       await Postmodel.findByIdAndDelete({_id:ID});
       res.status(202).json({"msg":"Post Deleted successfully"})
    } catch (error) {
        console.log("error while deleting",error);
        res.json({"msg":"error while deleting"})
    }
})
postRoute.post("/posts/:id/like",async(req,res)=>{
    let id=req.params.id;
    let user=req.body.user;
    try {
        let allPost=await Postmodel.find({_id:id});
        let like=allPost[0].likes;
        like.push(user);
        await Postmodel.findByIdAndUpdate({_id:id},{likes:like})
        res.status(201).json({"msg":"like the post is saved"})
    } catch (error) {
        console.log("error while liking post",error);
        res.json({"msg":"error while liking post"})
    }
})
postRoute.post("/posts/:id/comment",async(req,res)=>{
    let id=req.params.id;
    
    let {user,text}=req.body;
    try {
        let allPost=await Postmodel.find({_id:id});
        let comment=allPost[0].comments;
        comment.push({user,text,createdAt:new Date()});
        await Postmodel.findByIdAndUpdate({_id:id},{comments:comment})
        res.status(201).json({"msg":"commented on post is saved"})
    } catch (error) {
        console.log("error while commenting on post",error);
        res.json({"msg":"error while commenting on  post"})
    }
})
module.exports={
    postRoute
}
