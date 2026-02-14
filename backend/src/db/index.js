import mongoose, { Schema } from "mongoose";

export const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Db is connected`)
    } catch (error) {
        console.log('Error to connect db',error)
        process.exit(1)
    }
}