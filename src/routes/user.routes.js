import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers";

const Router = Router()

Router.route("/register").post(registerUser)
Router.route("/login").post(loginUser)

export{Router}