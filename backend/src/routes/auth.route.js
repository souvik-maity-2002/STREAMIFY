import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const route = express.Router()



route.post("/login",login)
route.post("/signup",signup)
route.post("/logout",logout)

route.post("/onboarding",protectRoute,onboard)

//forgot-password
//send-reset-password-email

//check auth
route.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user})
})

export default route