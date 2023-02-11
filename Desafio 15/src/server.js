import express from 'express';
import handlebars from 'express-handlebars'
import path from 'path';
import {fileURLToPath} from 'url';
import { ContenedorDaoChat } from './daos/fabric.js';
import { Server } from 'socket.io';
import { normalize, schema } from 'normalizr';
import { faker } from '@faker-js/faker';
faker.locale="es";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { UserModel } from './models/user.js';
import passport from 'passport';
import InitPassport from './passport/initPassport.js';
import flash from 'connect-flash';
import { envConfig } from './config/envConfig.js';
import parseArgs from 'minimist';
import { fork } from 'child_process';
import cluster from 'cluster';
import os from 'os';
import compression from 'compression';
import { logger } from './logger/winston.js';



const processArgDefault = {alias:{p:"port", m:"modo"}, default:{port:8080, modo:"FORK"}}
const argumentos = parseArgs(process.argv.slice(2), processArgDefault);
const PORT = argumentos.port;
const MODO = argumentos.modo;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mensajesDB = ContenedorDaoChat;
const viewsFolder = path.join(__dirname,"views");
const {commerce, image} = faker;
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

    //Socket
    const io = new Server(server);
    io.on("connection", async(socket)=>{
        logger.info("Nueva conexion del socket")
        socket.emit("productsArray", products);

        socket.on("enableChat", async()=>{
            socket.emit("chatArray", await normalizadorMensajes());
        })
        socket.on("newMessage", async(data)=>{
            await mensajesDB.save(data);
            io.sockets.emit("chatArray", await normalizadorMensajes())
        })
    })
}

app.use(express.static(__dirname+"/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Handlebars
app.engine("handlebars",handlebars.engine());
app.set("views", viewsFolder);
app.set("view engine", "handlebars");

//Mongo
mongoose.set("strictQuery", false);
mongoose.connect(envConfig.S_MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true
},(error)=>{
    if(error){logger.error("Conexion fallida")};
    logger.info("Base de datos conectada correctamente")
});

//Cokkies
app.use(cookieParser());

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: envConfig.S_MONGO_URL,
    }),
    secret: envConfig.S_SESSION_SECRET,
    cookie: { maxAge: 600000},
    resave:false,
    rolling:true,
    saveUninitialized:false
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());



//Normalizacion
const authorSchema = new schema.Entity("authors",{},{idAttribute:"email"});
const messageSchema = new schema.Entity("messages",
    {
        author:authorSchema
    }
);
const chatSchema = new schema.Entity("chat",
    {
        messages:[messageSchema]
    }
);
const normalizadorDatos = (data) =>{
    const dataNormalizada = normalize({id:"chatHistory", messages:data}, chatSchema);
    return dataNormalizada;
};

const normalizadorMensajes = async () =>{
    const messages = await mensajesDB.getAll();
    const normalizedMessages = normalizadorDatos(messages);
    return normalizedMessages;
};

//Flash
app.use(flash())

//Passport
InitPassport(passport)

    //Serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        return done(null, user._id)
    });
    passport.deserializeUser((id,done)=>{
        UserModel.findById(id,(error,userFound)=>{
            return done(error,userFound)
        })
    });

//Faker
let products =[];
    for(let i =0;i<5;i++){
        products.push(
            {
                title: commerce.product(),
                price: commerce.price(),
                thumbnail: image.technics(200, 200, true)
            }
        )
    };




const isAuthenticated =  (req, res, next) => {
    if (req.isAuthenticated())
	    return next();
    res.redirect('/login');
}

app.get("/", isAuthenticated, (req,res)=>{
    logger.info("Ruta '/' en metodo get")
    res.render("index",{name: req.session.usuario})
})


app.get('/productos', isAuthenticated, async(req, res) =>{
    logger.info("Ruta '/productos' en metodo get")
    res.render("productos", {
        productos:products
    })
})

app.get("/login", async(req, res) =>{
    logger.info("Ruta '/login' en metodo get")
    res.render("login", {message: req.flash('message')});
})


app.post('/login', passport.authenticate('LoginStrategy', {
    failureRedirect: '/',
    failureFlash:true
}), (req, res)=>{
    logger.info("Ruta '/login' en metodo post")
    const {email} = req.body
    req.session.usuario = email
    res.redirect("/")
});

app.get("/signup", async(req, res) =>{
    logger.info("Ruta '/signup' en metodo get")
    res.render("signup",{message: req.flash('message')});
})

app.post('/signup', passport.authenticate('SignUpStrategy', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.get("/logout", async(req, res) =>{
    logger.info("Ruta '/logout' en metodo get")
    const nombre = await req.session.usuario;
    req.session.destroy(err =>{
        if(err){
            return res.redirect("/")
        }else{
            req.logout()
            res.render("logout", {name: nombre});
        }
    });
})

app.get("/info",compression(), async(req, res) =>{
    logger.info("Ruta '/info' en metodo get")
    const informacion = {
        Argumentos_de_entrada: process.argv.slice(2),
        Nombre_de_Plataforma: process.platform,
        Version_de_Node: process.versions.node,
        Memoria_Total_Reservada: process.memoryUsage().rss,
        Path_de_Ejecucion: process.execPath,
        ProcessID: process.pid,
        Carpeta_del_Projecto: process.cwd(),
        Nucleos_CPU: os.cpus().length
    }
    console.log(informacion);
    res.json(informacion);
})

app.get("/infoAsync",compression(), async(req, res) =>{
    logger.info("Ruta '/info' en metodo get")
    const informacion = {
        Argumentos_de_entrada: process.argv.slice(2),
        Nombre_de_Plataforma: process.platform,
        Version_de_Node: process.versions.node,
        Memoria_Total_Reservada: process.memoryUsage().rss,
        Path_de_Ejecucion: process.execPath,
        ProcessID: process.pid,
        Carpeta_del_Projecto: process.cwd(),
        Nucleos_CPU: os.cpus().length
    }
    res.json(informacion);
})

app.get('*', function(req, res){
    logger.warn("Ruta inexistente")
    res.send("Ruta inexistente");
});

/* var desafios = express.Router();

desafios.get("/randoms",(req,res)=>{
    const query = parseInt(req.query.cant) || 100000000
    const child = fork("child.js");
    child.on("message",(childMsg)=>{
        if(childMsg == "preparado"){
            child.send(query)
        } else{
            res.json([childMsg])
        }
    })
});

app.use('/desafios',desafios); */