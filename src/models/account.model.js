import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";//single point of truth to get balance
const accountSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with a user"],
        index:true//user id ke along side index help in searching as multiple users
    },//b+ tree is used in indexing 
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Values not allowd",
        },
        default:"ACTIVE",
    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
    },
},{timestamps:true})

accountSchema.index({user:1,status:1})

accountSchema.methods.getBalance = async function (){
    const balanaceData = await ledgerModel.aggregate([
        {$match:{account:this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ],
                    }
                },
                totalCredit:{
                     $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ],
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{
                    $subtract:["$totalCredit","$totalDebit"]
                }
            }
        }
    ])

    if(balanaceData.length ==0){
        return 0;
    }
    return balanaceData[0]?.balance ?? 0; //like this balanceData:[{balance:2500}]--0
}

const accountModel = mongoose.model("account",accountSchema)

export default accountModel;