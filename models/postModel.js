const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
        user: { type: "ObjectId", ref: 'user' },
        text: String,
        image: String,
        createdAt: Date,
        likes: [{ type: "ObjectId", ref: 'user' }],
        comments: [{
          user: { type: "ObjectId", ref: 'user' },
          text: String,
          createdAt: Date
        }]
})

const Postmodel=mongoose.model("post",postSchema);

module.exports={
    Postmodel
}