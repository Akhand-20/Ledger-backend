import accountModel from "../models/account.model.js";
import userModel from "../models/user.model.js";
import ledgerModel from "../models/ledger.model.js";

export const createAccount = async (req, res) => {
    try {
        const user = req.user
        const currency = req.body.currency
        const account = await accountModel.create({
            user: user._id,
            currency,
        })
        await ledgerModel.create({
            account: account._id,
            amount: 1000,
            type: "CREDIT",
            source: "WELCOME_BONUS"
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

export const getUserAccount = async (req, res) => {
    try {
        const accounts = await accountModel.find({ user: req.user._id });

        return res.status(200).json({
            accounts
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getAccountBalance = async (req, res) => {
    const { accountId } = req.params;
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
        const balance = await account.getBalance();

        res.status(200).json({
            accountId: account._id,
            balance: balance
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
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

export const findAccountByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await userModel.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const account = await accountModel.findOne({ user: user._id })
        if (!account) {
            return res.status(404).json({ message: "User has no account" })
        }

        return res.status(200).json({
            username: user.username,
            accountId: account._id
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
