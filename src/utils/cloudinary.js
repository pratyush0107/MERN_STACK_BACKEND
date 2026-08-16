import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

        const uploadResult = await cloudinary.uploader.upload(localFilePath);

        console.log("File uploaded to Cloudinary:", uploadResult);

        // Remove local file after successful upload
        fs.unlinkSync(localFilePath);

        return uploadResult;

    } catch (error) {
        console.log("Cloudinary upload error:", error);

        // Remove local file if it exists
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };