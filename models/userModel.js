const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
        name: String,
        email: String,
        password: String,
        dob: Date,
        bio: String,
        posts: [{ type: "ObjectId", ref: 'post' }],
        friends: [{ type: "ObjectId", ref: 'user' }],
        friendRequests: [{ type: "ObjectId", ref: 'user' }]
})

const Usermodel=mongoose.model("user",userSchema);

module.exports={
    Usermodel
}