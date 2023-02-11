import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.js";
import * as bcrypt from 'bcrypt'; 
import { envConfig } from "../config/envConfig.js";
import { logger } from "../logger/winston.js";

const SignUpPassport = (passport) =>{
    passport.use("SignUpStrategy", new LocalStrategy({
        passReqToCallback : true,
        usernameField:"email"
    },
    (req,username, password, done)=> {
        const findOrCreateUser = () =>{
            UserModel.findOne({email:username}, (err, user)=>{
                if (err){
                    logger.error('Error al Iniciar Sesion: '+err);
                    return done(err);
                }
                if (user) {
                    logger.warn('Usuario ya existente con este email: '+username);
                    return done(null, false, req.flash('message', 'Usuario ya existente'));
                } else{
                    var newUser = new UserModel();
                    newUser.email = username;
                    newUser.password = createHash(password);

                    newUser.save((err)=>{
                        if(err){
                            logger.error('Error al guardar usuario: '+err);  
                            throw err;  
                        }
                        logger.info('Usuario registrado con exito');    
                        return done(null, newUser);
                    });
                }
            });
        };
        process.nextTick(findOrCreateUser);
    }
    ))
}

var createHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(envConfig.E_BCRYPT_SALT)), null);
}

export default SignUpPassport;