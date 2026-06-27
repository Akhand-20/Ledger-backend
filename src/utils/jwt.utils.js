import jwt from 'jsonwebtoken';
export const generateToken=(user)=>{
    const JWT_SECRET= process.env.JWT_SECRET;
    console.log("SIGN SECRET:",JWT_SECRET );

    const token= jwt.sign(
        {userId:user._id},
        JWT_SECRET,
        {expiresIn:"3d"}
    )
     console.log("TOKEN:", token);

     return token;
}//token is generated