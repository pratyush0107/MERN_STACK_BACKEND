import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"120kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())


// Routes import
import {router as userRoute} from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/user",userRoute)


export { app }