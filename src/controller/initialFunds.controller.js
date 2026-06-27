import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import accountModel from "../models/account.model.js";
import mongoose from "mongoose";


export const createInitialFundTransaction = async (req, res) => {

    const { toAccountId, amount, idempotencyKey } = req.body

    if (!toAccountId || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount, toAcccount,amount,idempotencyKey are required",
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id: toAccountId,
    })
    if (!toUserAccount) {
        return res.status(404).json({
            message: "Invalid toAccount"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    })
    if (!fromUserAccount) {
        return res.status(404).json({
            message: "System user account not found"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction()

    try {
        const transaction = new transactionModel({
            fromAccountId: fromUserAccount._id,
            toAccountId,
            amount,
            idempotencyKey,
            status: "PENDING"
        })

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccountId,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        transaction.status = "COMPLETED"

        await transaction.save({ session })//saves the updated data in db

        await session.commitTransaction()//makes all transaction changes permanent
        session.endSession()

        return res.status(201).json({
            message: "Initial Funds Transaction Completed Succesfully",
            transaction: transaction

        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        return res.status(500).json({
            message: "Initial Funds Transaction failed",
            error: error.message
        })
    }
}