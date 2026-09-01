import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
cloud_name: process.env.CLOUDINARY_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
try {
if (!localFilePath) {
return null;
}


    const uploadResult = await cloudinary.uploader.upload(
        localFilePath,
        {
            resource_type: "auto"
        }
    );

    console.log("File uploaded to Cloudinary:", uploadResult.secure_url);

    return uploadResult;

} catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;

} finally {
    // This always executes
    if (localFilePath && fs.existsSync(localFilePath)) {
        try {
            fs.unlinkSync(localFilePath);
            console.log("Local file deleted:", localFilePath);
        } catch (unlinkError) {
            console.error("Error deleting local file:", unlinkError);
        }
    }
}


};

export { uploadOnCloudinary };
