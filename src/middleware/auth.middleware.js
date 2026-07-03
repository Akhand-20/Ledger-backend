import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import tokenBlacklistModel from "../models/blacklist.model.js";
//Function to check user has token or not 
export const authMiddleware=async(req,res,next)=>{

    const token =req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access token is missing",

        })
    }//one more check if token comes 
    const isBlackListed= await tokenBlacklistModel.findOne({token})
    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorized access token is missing"
        })
    }


    //if token is there then we will verify 
    try{
        const decode =jwt.verify(token,process.env.JWT_SECRET)

        const user= await userModel.findById(decode.userId)
        
        req.user=user
        next();//after finishing the middleware it continues to controller means next function
    }catch(error){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }
}

export const systemUserMiddleware = async(req,res,next)=>{
    const token =req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access token is missing",

        })
    }
    

    try{
        const decode =jwt.verify(token,process.env.JWT_SECRET)

        const user= await userModel.findById(decode.userId).select("+systemUser")

        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, not system user"
            })
        }
        req.user=user
        next();

    }catch(error){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }
}
