
import dotenv from "dotenv";
import ConnectDB from "./database/index.js"
import dns from "dns";

dns.setServers(["8.8.8.8"]);

ConnectDB()