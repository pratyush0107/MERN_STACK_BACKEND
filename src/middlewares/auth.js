import { apiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { configDotenv } from "dotenv";
configDotenv()


const verifyJWT = asyncHandler(async (req,res,next)=>{
    console.log("inside verify")
    console.log("AUTH HEADER:", req.header("Authorization"));
    console.log("COOKIES:", req.cookies);
    const token = req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
   
    console.log("TOKEN:", token);
    if(!token){
        throw new apiErrors(401,"unauthoried user");
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET )

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    console.log(user)
    if(!user){
    throw new apiErrors(401,"Invalid Access Token")
    }

    req.user=user;
    next()
})  
 export {verifyJWT}