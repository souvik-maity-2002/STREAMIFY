import express from "express";
import {login,signup,logout} from "../controller/auth.controller.js"

export const route = express.Router()



route.post("/login",login)
route.post("/signup",signup)
route.post("/logout",logout)

export default route