import mongoose from "mongoose";

const ledgerSchema =new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with a user"],
        index:true,
        immutable:true//since we wil not forcefully modify the entry 
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        immutable:true
    },
    //which accounts transaction it is 
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        // required:[true,"Ledger must be associated with a user"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either debit or credit"            
        },
        required:[true,"Ledger type is required"],
        immutable:true
    },
    source: {
        type: String,
        enum: ["TRANSFER", "WELCOME_BONUS"],
        default: "TRANSFER",
        immutable: true
    }
})

//this ledger is single moment of truth so in future it can be modified by any chance 

function preventLedgerModification(){
    throw new Error ("Ledger enteries can not be modified and deleted")
}
//all operations are prohibited 
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification)
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('findByIdAndUpdate', preventLedgerModification);

ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findByIdAndDelete', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);

const ledgerModel = mongoose.model("ledger",ledgerSchema)

export default ledgerModel;