import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";

export const getTransactionHistory = async (req, res) => {
    const { accountId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

        const transactions = await transactionModel.find({
            $or: [
                { fromAccountId: accountId },
                { toAccountId: accountId }
            ]
        })
            .populate({ path: "fromAccountId", populate: { path: "user", select: "username" } })
            .populate({ path: "toAccountId", populate: { path: "user", select: "username" } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await transactionModel.countDocuments({
            $or: [
                { fromAccountId: accountId },
                { toAccountId: accountId }
            ]
        })

        return res.status(200).json({
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}