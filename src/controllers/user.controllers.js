
     // user details from front end
     // validation - not empty
     // check if user already exists : uesername , email
     // check for image check for avatar
     // upload them on cloudinary
     // create user object - create entry in db
     // remove password and refresh token field from response
     // check for user creation
    //  // return response
 
import { apiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { generate_accesstoken_refreshToken } from "../controllers/login.controllers.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log("\n========== NEW REQUEST ==========");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body:", req.body);
    console.log("Request files shown:", req.files);
    if (!req.body) {
        throw new apiErrors(400, "Request body is missing");
    }
    // Get user details from frontend
    const { fullname, username, email, password } = req.body;

    // Validate fields
    if (
        [fullname, username, email, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new apiErrors(400, "All fields are required");
    }

    // Check if user already exists
    const userExistence = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExistence) {
        throw new apiErrors(
            409,
            "User with email or username already exists"
        );
    }

    // Get files uploaded by multer
   const avatarLocalFilePath = req.files?.avatar?.[0]?.path;
   console.log("BODY:", req.body);
   console.log("FILES:", req.files);
// const avatarFile = req.files?.find(
//     (file) => file.fieldname === "avatar"
// );

// const coverImageFile = req.files?.find(
//     (file) => file.fieldname === "coverImage"
// );

// const coverImageLocalFilePath = coverImageFile?.path;

// const avatarLocalFilePath = avatarFile?.path;

    const coverImageLocalFilePath =
        req.files?.coverImage?.[0]?.path;

    // Avatar is required
    if (!avatarLocalFilePath) {
        throw new apiErrors(400, "Avatar image is required");
    }

    // Upload avatar to Cloudinary
    const avatarUpload = await uploadOnCloudinary(
        avatarLocalFilePath
    );

    if (!avatarUpload) {
        throw new apiErrors(
            500,
            "Avatar image upload failed"
        );
    }

    // Upload cover image only if provided
    let coverImageUpload;

    if (coverImageLocalFilePath) {
        coverImageUpload = await uploadOnCloudinary(
            coverImageLocalFilePath
        );
    }

    // Create user in database
    const userDB = await User.create({
        fullname,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Get created user without password and refresh token
    const createdUser = await User.findById(userDB._id).select(
        "-password -refreshToken"
    );

    // Check if user was created
    if (!createdUser) {
        throw new apiErrors(
            500,
            "User could not be created"
        );
    }
     
    // Return response
    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                createdUser,
                "User registered successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiErrors(401, "Unauthorized request: Refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new apiErrors(404, "User not found or invalid token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiErrors(401, "Refresh token is expired or has already been used");
        }

        const { accessToken, refreshToken } = await generate_accesstoken_refreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new apiErrors(
            error.statusCode || 401,
            error.message || "Invalid or expired refresh token"
        );
    }
});

const changePassword =  asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body()

    const user = await User.findById(req?.id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)

    if(!isPasswordCorrect){
        throw new apiErrors(401,"incoorect password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    res.status(200)
    .json(
        
            new apiResponse(200,"passwaord changed successfully ")
        
    )

})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(200, req.user," current user fetched successfully ")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname , email} = req.body();
    if(!fullname||!email){
        throw new apiErrors(401,"fullname or email is required")
    }
    const user = User.findByIdAndUpdate(req.user._id,
        {
            $set: {
               fullname,
               email:email
            }
        },
        {new:ture}
    ).select("-password")
    return res.status(200)
    .json(new apiResponse(200,user,"user updated successfully"))
})

export { registerUser , refreshAccessToken , changePassword,  getCurrentUser };