import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    dir:{
        type:String,
        require:true
    },
    age:{
        type:String,
        require:true
    },
    tel:{
        type:String,
        require:true
    }
});

export const UserModel = mongoose.model(userCollection,userSchema);