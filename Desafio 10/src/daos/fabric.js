import { options } from "../config/DBConfig.js";
import mongoose from "mongoose";
import admin from "firebase-admin";
import { ChatModel } from "../models/chatModel.js";

let ContenedorDaoChat;

let databaseType = "filesystem";

switch(databaseType){
    case "filesystem":
        const {ChatDAOFileSystem} = await import("./chat/chatDAOFileSystem.js");
        ContenedorDaoChat = new ChatDAOFileSystem(options.fileSystem.path);
    break;

    case "mongo":
        mongoose.connect(options.mongo.path);
        const {ChatDAOMongo} = await import("./chat/chatDAOMongo.js");
        ContenedorDaoChat = new ChatDAOMongo(ChatModel);
    break;

    case "firebase":
        admin.initializeApp({
            credential: admin.credential.cert(options.firebase.key),
            databaseURL: options.firebase.databaseUrl
        });
        const {ChatDAOFirebase} = await import("./chat/chatDAOFirebase.js");
        ContenedorDaoChat = new ChatDAOFirebase("chat");
    break;
};

export {ContenedorDaoChat};