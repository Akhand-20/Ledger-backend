import mongoose from "mongoose";

const tokenBlacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"TOken is required to blacklist"],
        unique:[true,"Must be unique"]
    },
},{timestamps:true})

tokenBlacklistSchema.index({createdAt:1},{
    expireAfterSeconds:60 * 60 * 24 * 3
})
const tokenBlacklistModel=mongoose.model("tokenBlacklist",tokenBlacklistSchema)

export default tokenBlacklistModel;
