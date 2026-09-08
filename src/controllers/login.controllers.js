
import { apiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

// req body -> data
// username or email
// find the user
// check password
// generate access token and refresh token
// send cookie

const generate_accesstoken_refreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken= await user.generateAccessTokens();
        const refreshToken= await user.generateRefreshTokens();

        user.refreshToken=refreshToken;
        await user.save({ validateBeforeSave: false })

        return {refreshToken,accessToken}
        
    } catch (error) {
        throw new apiErrors(500,"something went wrong in generate tokens");
    }
}
 
const loginUser= asyncHandler(async (req,res)=>{
    console.log("inside loginUser")
    console.log(req.body) // use req.query if sending get request
    const {username,email,password} =req.body;
    
    if(!(username||email)){
        throw new apiErrors(400,"email or username is required");
    }
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(!user){
        throw new apiErrors(404,"user not found ");
    }
    const validPassword=await user.isPasswordCorrect(password);
    if(!validPassword){
        throw new apiErrors(401,"incorrect password or username");
    }

    const {refreshToken,accessToken}=await generate_accesstoken_refreshToken(user._id)

    const loggedUser= await User.findById(user._id).select("-password")

    const options ={
        httpOnly:true,
        secure: process.env.NODE_ENV === "production"
    }
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                "user":loggedUser, accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logOut =  asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
               refreshToken: 1
            }
        },
        {
           new: true
        }
        
    )
    const options ={
        httpOnly:true,
        secure: process.env.NODE_ENV === "production"
    }
   
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{"user": user},"user loggedout successfully"))
})

export {loginUser , logOut};