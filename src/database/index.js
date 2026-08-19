import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";
import express from "express";
import dotenv from "dotenv";

import dns from "dns";

dns.setServers(["8.8.8.8"]);


const app = express();

dotenv.config({
    path: "./.env"
});

console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI starts with:", process.env.MONGODB_URI?.substring(0, 15));
console.log("PORT:", process.env.PORT);

const ConnectDB= async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Database connected at host: ${connectionInstance}`);
        console.log(`Database connected at host: ${connectionInstance.connection.host}`);
        app.on("Error",(error)=>{
             console.error("Error in connection : ",error)
             throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port: ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("Error in connection : ",error)
        throw error
        process.exit(1)
    }
}

export default ConnectDB;