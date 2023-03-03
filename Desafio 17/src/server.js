import express from "express";
import handlebars from 'express-handlebars'
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from 'path';
import bodyParser from 'body-parser';
import { logger } from "./controllers/logger/log4js.js";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import { connectMongoDB } from './config/dbConnection.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import InitPassport from './services/passport/initPassport.js';
import { UserModel } from "./dbOperations/models/user.js";
import cluster from 'cluster';
import os from 'os';
import parseArgs from 'minimist';
import { router } from "./routes/api/home.routes.js";

const processArgDefault = {alias:{p:"port", m:"modo"}, default:{port:8080, modo:"FORK"}}
const argumentos = parseArgs(process.argv.slice(2), processArgDefault);
const PORT = argumentos.port || 8080;
const MODO = argumentos.modo;
const viewsFolder = path.join(`${__dirname}/routes`,"views")
const app = express();


//Logica cluster
if(MODO === "CLUSTER" && cluster.isPrimary){
    const cpuNumber = os.cpus().length;
    logger.info("numero de Nucelos: "+cpuNumber)
    for(let i=0;i<cpuNumber;i++){
        cluster.fork()
    }

    cluster.on('exit',(worker)=>{
        logger.warn(`El proceso ${worker.process.pid} dejo de funcionar`)
        cluster.fork();
    })
}else{

    //Servidor express
    const server = app.listen(PORT, ()=>logger.info(`Servidor escuchando el puerto: ${PORT}, en proceso ${process.pid}`));
}


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Handlebars
app.engine("handlebars",handlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("views", viewsFolder);
app.set("view engine", "handlebars");

//Mongo
connectMongoDB();
console.log(viewsFolder)

//Cokkies
app.use(cookieParser());

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://Santidd11:coder.backend@cluster0.kc4fhea.mongodb.net/CoderDB?retryWrites=true&w=majority",
    }),
    secret: "secreto",
    cookie: { maxAge: 600000},
    resave:false,
    rolling:true,
    saveUninitialized:false
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash())

//Passport
InitPassport(passport);

//Serializacion y deserializacion
passport.serializeUser((user,done)=>{
    return done(null, user._id)
});
passport.deserializeUser((id,done)=>{
    UserModel.findById(id,(error,userFound)=>{
        return done(error,userFound)
    })
});

//Routes
app.use(router)


