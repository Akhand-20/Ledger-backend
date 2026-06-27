import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import accountModel from "../models/account.model.js";
import { sendTransactionEmail, sendTransactionFailureEmail } from "../service/email.service.js";
import mongoose from "mongoose";
//both will be required

export const createTransaction = async (req, res) => {
    const { fromAccountId, toAccountId, amount, idempotencyKey } = req.body;

    if (!fromAccountId || !toAccountId || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount, toAcccount,amount,idempotencyKey are required",

        })
    }
    //1-> that id exists 
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccountId,
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccountId,
    })
    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "Invalid toAccount or fromAccount"
        })
    }

    //2->now validate idempotency key

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status == "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status == "PENDING") {
            return res.status(200).json({
                message: "Transaction is in processed",
            })
        }

        if (isTransactionAlreadyExists.status == "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed",
            })
        }

        if (isTransactionAlreadyExists.status == "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed ,please retry",
            })
        }

    }

    //3-> Check account status 

    if (fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE") {
        return res.status(500).json({
            message:"One or both accounts are not active",
        })
    }

    /**
     * 4~~>Derive sender balance from ledger =>to do this we will write a function in accountModel
     */

    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient Balance. Current Balance is ${balance}.Requested amount is ${amount}`
        })
    }
    let transaction = null;
    //5-> Create Transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        transaction = (await transactionModel.create([{
            fromAccountId,
            toAccountId,
            amount,
            idempotencyKey,

        }], { session }))[0]

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccountId,
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

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction()//makes all transaction changes permanent
        session.endSession()//close the session
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({
            message: "Transaction failed",
            error: error.message
        })
    }

    //Send email notification 

    await sendTransactionEmail(req.user.email, req.user.username, amount, toAccountId)

    return res.status(201).json({
        message: "Transaction Completed Succesfully",
        transaction: transaction

    })


}