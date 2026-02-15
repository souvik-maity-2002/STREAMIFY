import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error("Stream API key or secret is missing");
}

const streamClient = new StreamChat(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
try {
    const streamUser = {
        id: userData._id.toString(),
        name: userData.fullName,
        image: userData.profilePic || "",
    };

    
    await streamClient.upsertUser(streamUser);

    return streamUser;
    } catch (error) {
        console.error("Error upserting stream user:", error);
    throw error;
}
};

export const generateStreamToken = (userId) => {
    try {
    // ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};
