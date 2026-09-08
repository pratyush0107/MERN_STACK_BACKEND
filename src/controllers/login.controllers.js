
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

        User.refreshToken=refreshToken;
        await User.save({ validateBeforeSave: false })

        return {refreshToken,accessToken}
        
    } catch (error) {
        throw new apiErrors(500,"something went wrong in generate tokens");
    }
}
 
const loginUser= asyncHandler(async (req,res)=>{
    console.log("inside loginUser")
    console.log(req.body) // use req.query if sending get request
    const {username,email,password} =req.body;
    
    if(!username||!email){
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
        secure:true
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

const logout =  asyncHandler((req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
               refreshToken:undefined
            }
        },
        {
           new: true
        }
        
    )
    const options ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"user loggedout successfully"))
})

export {loginUser , logOut};