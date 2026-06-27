import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import mongoose from "mongoose";

export const reverseTransaction = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await transactionModel.findById(transactionId)

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        if (transaction.status !== "COMPLETED") {
            return res.status(400).json({
                message: "Only completed transactions can be reversed"
            })
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // reverse: credit back to sender, debit from receiver
            await ledgerModel.create([{
                account: transaction.fromAccountId,
                amount: transaction.amount,
                transaction: transaction._id,
                type: "CREDIT"  // sender gets money back
            }], { session })

            await ledgerModel.create([{
                account: transaction.toAccountId,
                amount: transaction.amount,
                transaction: transaction._id,
                type: "DEBIT"  // receiver loses money
            }], { session })

            transaction.status = "REVERSED"
            await transaction.save({ session })

            await session.commitTransaction()
            session.endSession()

            return res.status(200).json({
                message: "Transaction reversed successfully",
                transaction
            })

        } catch (error) {
            await session.abortTransaction()
            session.endSession()

            return res.status(500).json({
                message: "Reversal failed",
                error: error.message
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}