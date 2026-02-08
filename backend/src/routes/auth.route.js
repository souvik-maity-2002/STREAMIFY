import express from "express";
const route = express.Router()

route.get("/login",(req,res)=>{
    res.send("login route")
})

route.get("/signup",(req,res)=>{
    res.send("signup route")
})

route.get("/logout",(req,res)=>{
    res.send("logout route")
})

export default route