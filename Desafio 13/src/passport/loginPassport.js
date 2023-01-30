import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.js";
import * as bcrypt from 'bcrypt'; 

const LoginPassport = (passport)=>{

    passport.use("LoginStrategy", new LocalStrategy({
        passReqToCallback: true,
        usernameField:"email"
    },
    (req,username,password, done)=>{
        UserModel.findOne({email:username},(err,userFound)=>{
            if(err) return done(err);
            if(!userFound){
                console.log('usuario no encontrado con email '+username);
                return done(null, false, req.flash('message', 'Usuario no encontrado'));
            }
            if (!isValidPassword(userFound, password)){
                console.log('Contraseña invalida');
                return done(null, false, req.flash('message', 'Contraseña Invalida.'));
            }
            return done(null, userFound);
        }
        );
    }
    ));
}

var isValidPassword = function(userFound, password){
    return bcrypt.compareSync(password, userFound.password);
}

export default LoginPassport;