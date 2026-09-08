import { apiErrors } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jwt";
import { User } from "../models/user.model.js";
import { configDotenv } from "dotenv";
configDotenv()


const verifyJWT = asyncHandler((req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization").replace("bearer ","")

    if(!token){
        throw new apiErrors(401,"unauthoried user");
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET )

    const user = User.findById(decodedToken._id).select("-password -refreshToken")

    if(!user){
    throw new apiErrors(401,"Invalid Access Token")
    }

    req.user=user;
    next()
})  
