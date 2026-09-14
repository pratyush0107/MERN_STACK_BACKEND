import { Router } from "express";
import {  registerUser } from "../controllers/user.controllers.js";
import { loginUser, logOut } from "../controllers/login.controllers.js";
import {upload} from "../middlewares/multer.js";
import {verifyJWT} from "../middlewares/auth.js";
import { refreshAccessToken } from "../controllers/user.controllers.js";
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

//secured routes
router.route("/logout").post((req, res, next) => {
        console.log("LOGOUT ROUTE REACHED");
        next();
    },verifyJWT,logOut)

router.route("/refreshToken").post(refreshAccessToken)

export{router}