import User from "../models/User.model.js"
import jwt from 'jsonwebtoken'

export async function signup(req,res){
const {email,password,fullName}=req.body

try {
    if(!email || !fullName ||!password){
        return res.status(400).json({message:"All fields are required"})
    }

    if (password.length<6) {
        return res.status(400).json({message:"password must be at least 6 character"})
    }

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({message:"Invalid email format"})
    }

    const existingUser=await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({message:"Email is already exist ,please use a different one"})
    }

    const idx=Math.floor(Math.random()*100)+1; // generate a no 1 to 100
    const randomAvatar =`https://avatar.iran.liara.run/public/${idx}.png`

    const newUser = await User.create({
        email,
        password,
        fullName,
        profilePic:randomAvatar,
    })

    const token =jwt.sign(
        {
            userId:newUser._id
        },
        process.env.JWT_SECRET_KEY,
    {
        expiresIn:"7d"
    });

    res.cookie("jwt",token,{
        maxAge:7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV==="production"
        }
    )

    res.status(201).json({success:true, user:newUser})

} catch (error) {
    console.log("Error in signup",error)
    res.status(500).json({message:'Internal server error'})
}
}

export async function login(req,res){
    res.send("login route")
}

export function logout(req,res){
    res.send("logout route")
}