import { Router } from "express";
import {  registerUser } from "../controllers/user.controllers.js";
import { loginUser } from "../controllers/login.controllers.js";
import {upload} from "../middlewares/multer.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
// router.post(
//     "/register",
//     upload.any(),
//     registerUser
// );

router.route("/login").post(loginUser)

export{router}