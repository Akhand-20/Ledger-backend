import accountModel from "../models/account.model.js";

export const createAccount = async (req, res) => {
    try {
        const user = req.user
        const currency = req.body.currency
        const account = await accountModel.create({
            user: user._id,
            currency,
        })
        return res.status(201).json({
            account
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getUserAccount=async(req,res)=>{
    try{
    const accounts = await accountModel.find({user:req.user._id});

    return res.status(200).json({
        accounts
    })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

export const getAccountBalance=async(req,res)=>{
    const {accountId}=req.params;
    try{
    const account=await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })
    if(!account){
        return res.status(404).json({
            message:"Account not found"
        })
    }
    const balance = await account.getBalance();

    res.status(200).json({
        accountId:account._id,
        balance:balance 
    })
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

export const updateAccountStatus = async (req, res) => {
    const { accountId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["ACTIVE", "FROZEN", "CLOSED"];

    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Status must be ACTIVE, FROZEN or CLOSED"
        })
    }

    try {
        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        })

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            })
        }

        if (account.status === "CLOSED") {
            return res.status(400).json({
                message: "Closed accounts cannot be modified"
            })
        }

        account.status = status;
        await account.save();

        return res.status(200).json({
            message: `Account ${status.toLowerCase()} successfully`,
            account
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}