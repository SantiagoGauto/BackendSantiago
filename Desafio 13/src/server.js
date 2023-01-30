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



const processArgDefault = {default:{p:8080}, alias:{p:"port"}}
const argumentos = parseArgs(process.argv.slice(2), processArgDefault);
const PORT = argumentos.port;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mensajesDB = ContenedorDaoChat;
const viewsFolder = path.join(__dirname,"views");
const {commerce, image} = faker;


//Servidor express
const app = express();
const server = app.listen(PORT, ()=>console.log(`Servidor escuchando el puerto: ${PORT}`));
app.use(express.static(__dirname+"/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Handlebars
app.engine("handlebars",handlebars.engine());
app.set("views", viewsFolder);
app.set("view engine", "handlebars");

//Mongo
mongoose.connect(envConfig.S_MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true
},(error)=>{
    if(error) console.log("Conexion fallida");
    console.log("base de datos conectada correctamente")
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


//Socket
const io = new Server(server);
io.on("connection", async(socket)=>{
    console.log("nueva Conexion")
    socket.emit("productsArray", products);

    socket.on("enableChat", async()=>{
        socket.emit("chatArray", await normalizadorMensajes());
    })
    socket.on("newMessage", async(data)=>{
        await mensajesDB.save(data);
        io.sockets.emit("chatArray", await normalizadorMensajes())
    })
})

const isAuthenticated =  (req, res, next) => {
    if (req.isAuthenticated())
	    return next();
    res.redirect('/login');
}

app.get("/", isAuthenticated, (req,res)=>{
    res.render("index",{name: req.session.usuario})
})


app.get('/productos', isAuthenticated, async(req, res) =>{
    res.render("productos", {
        productos:products
    })
})

app.get("/login", async(req, res) =>{
    res.render("login", {message: req.flash('message')});
})


app.post('/login', passport.authenticate('LoginStrategy', {
    failureRedirect: '/',
    failureFlash:true
}), (req, res)=>{
    const {email} = req.body
    req.session.usuario = email
    res.redirect("/")
});

app.get("/signup", async(req, res) =>{
    res.render("signup",{message: req.flash('message')});
})

app.post('/signup', passport.authenticate('SignUpStrategy', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.get("/logout", async(req, res) =>{
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

app.get("/info", async(req, res) =>{
    const informacion = {
        Argumentos_de_entrada: process.argv.slice(2),
        Nombre_de_Plataforma: process.platform,
        Version_de_Node: process.versions.node,
        Memoria_Total_Reservada: process.memoryUsage().rss,
        Path_de_Ejecucion: process.execPath,
        ProcessID: process.pid,
        Carpeta_del_Projecto: process.cwd()
    }
    res.json(informacion);
})

var desafios = express.Router();

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

app.use('/desafios',desafios);