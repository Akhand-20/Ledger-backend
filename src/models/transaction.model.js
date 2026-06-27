import mongoose from "mongoose";

const transactionSchema =new mongoose.Schema({

     fromAccountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a user"],
        index:true
     },

     toAccountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a user"],
        index:true
     },

     status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can be either PENDING,COMPLETED,FAILED or REVERSED",
        },
        default:"PENDING"
     },
     amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        min:[0,"Transaction can not be zero"]
     },
     idempotencyKey:{//helps in preventing the execution of same transactions more than once 
        type:String,//generated on client side 
        required:[true,"Idempotency Key is required for creating a transaction"],
        index:true,
        unique:true
     }
},{timestamps:true})

const transactionModel = mongoose.model("transaction",transactionSchema)

export default transactionModel;