import { upsertStreamUser } from "../utils/stream.js";
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

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY missing");
    }


    const idx=Math.floor(Math.random()*100)+1; // generate a no 1 to 100
    const randomAvatar =`https://avatar.iran.liara.run/public/${idx}.png`

    const newUser = await User.create({
        email,
        password,
        fullName,
        profilePic:randomAvatar,
    })

    try {
        await upsertStreamUser(newUser);
        console.log(`Stream user created/updated for ${newUser.fullName}`);
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }

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

export async function login(req, res) {
try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // must select password manually
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY missing");
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ success: true, user: userResponse });

} catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: "Internal server error" });
}
}


export function logout(req, res) {
res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
});

res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function onboard(req,res){
    try {
        const userId=req.user._id
        const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message:"All fields are required",
                missingFields :[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
        })
    }

    const updatedUser=await User.findByIdAndUpdate(userId,{
        ...req.body,
        isOnboarded:true
    },{new:true})
    if (!updatedUser) {
        return res.status(404).json({message:"User not found"})
    }

    try {
        // await upsertStreamUser({
        //     id:updatedUser._id.toString(),
        //     name:updatedUser.fullName,
        //     image:updatedUser.profilePic || "",
        // })
        await upsertStreamUser(updatedUser);
        
        console.log(`Stream user upserted for onboarding: ${updatedUser.fullName}`)
    } catch (streamError) {
        console.log("Error upserting Stream user during onboarding:", streamError)
    }

    res.status(200).json({success:true,user:updatedUser})

    } catch (error) {
        console.error("Error in onboarding",error)
        res.status(500).json({message:"Internal server error"})
    }
}