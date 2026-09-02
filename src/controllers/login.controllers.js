
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
 
const loginUser= asyncHandler(async (req,res)=>{
    
})

export {loginUser};