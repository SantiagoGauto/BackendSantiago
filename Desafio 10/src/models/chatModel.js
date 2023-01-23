import mongoose from "mongoose";

const chatCollection = "chat";
const chatSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    author:{
        type: Object,
        required: true
    }
});
export const ChatModel = mongoose.model(chatCollection, chatSchema);