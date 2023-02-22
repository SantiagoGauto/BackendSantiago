import LoginPassport from "./loginPassport.js";
import SignUpPassport from "./signUpPassport.js";
import { UserModel } from "../models/user.js";

const InitPassport = (passport) =>{
    //Serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        return done(null, user._id)
    });
    passport.deserializeUser((id,done)=>{
        UserModel.findById(id,(error,userFound)=>{
            return done(error,userFound)
        })
    });

    SignUpPassport(passport);
    LoginPassport(passport);

}

export default InitPassport;