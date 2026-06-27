import userModel from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { sendRegisterationEmail } from "../service/email.service.js";
import tokenBlacklistModel from "../models/blacklist.model.js";

export const userRegisterController = async (req, res) => {
    const { email, username, password } = req.body;//gets data from request body

    const isExists = await userModel.findOne({
        email: email
    })
    if (isExists) {
        return res.status(422).json({
            message: "User already exists",
            status: "failed"
        })
    }

    try {
        const user = await userModel.create({
            email, password, username
        })

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 360000
        })
        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                username: user.username
            },
            // token
        })
        await sendRegisterationEmail(user.email, user.username)//after sending response to server we will send email
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const userLoginController = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    try {
        const user = await userModel.findOne({ email }).select("+password")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }
        const token = generateToken(user)
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 360000
        })
        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                username: user.username
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const userLogoutController = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            message: "No token provided, already logged out",
        })
    }

    try {
        await tokenBlacklistModel.create({
            token: token,
        })
        res.clearCookie("token")//clearing cookie

        return res.status(200).json({
            message: "Logged out succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}